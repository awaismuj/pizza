const https = require("https");
const createHttpError = require("http-errors");

const DRIVE_FILE_ID_PATTERN = /^[\w-]{10,128}$/;
const REDIRECT_HOSTS = new Set(["drive.google.com", "drive.usercontent.google.com"]);
const AUDIO_CONTENT_TYPES = /^(audio\/|application\/octet-stream$)/i;

const streamMusic = (req, res, next) => {
    const { fileId } = req.params;
    if (!DRIVE_FILE_ID_PATTERN.test(fileId)) {
        return next(createHttpError(400, "Enter a valid Google Drive file ID."));
    }

    const range = req.get("range");
    if (range && (range.length > 200 || !/^bytes=\d*-\d*(?:,\d*-\d*)*$/.test(range))) {
        return next(createHttpError(400, "The requested audio range is invalid."));
    }

    const initialUrl = new URL("https://drive.google.com/uc");
    initialUrl.searchParams.set("export", "download");
    initialUrl.searchParams.set("id", fileId);

    const proxyStream = (url, redirectCount = 0) => {
        const headers = {};
        if (range) headers.Range = range;

        const upstreamRequest = https.get(url, { headers, timeout: 30000 }, (upstreamResponse) => {
            const statusCode = upstreamResponse.statusCode || 502;
            const location = upstreamResponse.headers.location;

            if ([301, 302, 303, 307, 308].includes(statusCode) && location) {
                upstreamResponse.resume();
                let redirectUrl;
                try {
                    redirectUrl = new URL(location, url);
                } catch {
                    return next(createHttpError(502, "Google Drive returned an invalid audio link."));
                }
                if (redirectCount >= 3 || redirectUrl.protocol !== "https:" || !REDIRECT_HOSTS.has(redirectUrl.hostname)) {
                    return next(createHttpError(502, "Google Drive returned an unsupported audio link."));
                }
                return proxyStream(redirectUrl, redirectCount + 1);
            }

            const contentType = upstreamResponse.headers["content-type"] || "";
            if ((statusCode === 200 || statusCode === 206) && !AUDIO_CONTENT_TYPES.test(contentType)) {
                upstreamResponse.resume();
                return next(createHttpError(502, "Google Drive did not return a playable audio file. Check its sharing settings and file type."));
            }
            if (statusCode === 416) {
                if (upstreamResponse.headers["content-range"]) {
                    res.set("Content-Range", upstreamResponse.headers["content-range"]);
                }
                upstreamResponse.resume();
                return res.sendStatus(416);
            }

            if (statusCode === 401 || statusCode === 403 || statusCode === 404) {
                upstreamResponse.resume();
                return next(createHttpError(502, "Google Drive could not access this file. Set it to Anyone with the link and try again."));
            }

            if (![200, 206].includes(statusCode)) {
                upstreamResponse.resume();
                return next(createHttpError(502, "Google Drive could not stream this file."));
            }

            res.status(statusCode);
            res.set("Content-Type", contentType || "audio/mpeg");
            res.set("Accept-Ranges", upstreamResponse.headers["accept-ranges"] || "bytes");
            res.set("Cache-Control", "private, no-store");
            for (const header of ["content-length", "content-range"]) {
                if (upstreamResponse.headers[header]) res.set(header, upstreamResponse.headers[header]);
            }
            upstreamResponse.pipe(res);
        });

        upstreamRequest.on("timeout", () => upstreamRequest.destroy(new Error("Google Drive audio request timed out.")));
        upstreamRequest.on("error", (error) => {
            if (res.destroyed) return;
            if (res.headersSent) {
                res.destroy(error);
                return;
            }
            console.error("Google Drive audio stream failed:", error.message);
            next(createHttpError(502, "Could not stream audio from Google Drive. Please try again."));
        });
        res.on("close", () => {
            if (!res.writableEnded) upstreamRequest.destroy();
        });
    };

    proxyStream(initialUrl);
};

module.exports = { streamMusic };
