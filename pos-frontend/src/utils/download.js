// Saves a Blob as a file, using the server's Content-Disposition name when
// it sent one.
export const saveBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const filenameFromResponse = (response, fallback) => {
  const header = response?.headers?.["content-disposition"] || "";
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(header);
  return match ? decodeURIComponent(match[1]) : fallback;
};

// Requests made with responseType "blob" return JSON error bodies as a Blob
// too — read it so the user sees the real message, not "Request failed".
export const blobErrorMessage = async (error, fallback) => {
  try {
    const data = error?.response?.data;
    if (data instanceof Blob) {
      const parsed = JSON.parse(await data.text());
      return parsed?.message || fallback;
    }
    return data?.message || fallback;
  } catch {
    return fallback;
  }
};
