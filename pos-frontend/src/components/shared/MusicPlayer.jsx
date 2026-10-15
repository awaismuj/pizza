import { useEffect, useMemo, useRef, useState } from "react";
import {
  FaExternalLinkAlt,
  FaFolderOpen,
  FaMusic,
  FaPause,
  FaPlay,
  FaPlus,
  FaRandom,
  FaRedo,
  FaStepBackward,
  FaStepForward,
  FaTimes,
  FaTrash,
  FaVolumeUp,
} from "react-icons/fa";

const STORAGE_KEY = "pizza-pos-music-player";
const EMPTY_SETTINGS = { folderUrl: "", tracks: [] };

const driveFileIdFromUrl = (value) => {
  try {
    const url = new URL(value);
    if (!["drive.google.com", "docs.google.com"].includes(url.hostname)) return "";
    const fileId = url.pathname.match(/\/file\/d\/([^/]+)/)?.[1] || url.searchParams.get("id") || "";
    return /^[\w-]+$/.test(fileId) ? fileId : "";
  } catch {
    return "";
  }
};

const driveAudioUrl = (fileId) => `https://drive.google.com/uc?export=download&id=${encodeURIComponent(fileId)}`;

const readSettings = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
    const tracks = Array.isArray(saved.tracks)
      ? saved.tracks.filter((track) =>
          track &&
          typeof track.id === "string" &&
          /^[\w-]+$/.test(track.id) &&
          typeof track.title === "string" &&
          typeof track.fileUrl === "string" &&
          driveFileIdFromUrl(track.fileUrl) === track.id
        )
      : [];
    return {
      folderUrl: typeof saved.folderUrl === "string" ? saved.folderUrl : "",
      tracks,
    };
  } catch (error) {
    console.error("Could not load saved music player settings:", error);
    return EMPTY_SETTINGS;
  }
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
};

const MusicPlayer = () => {
  const [settings, setSettings] = useState(readSettings);
  const [isOpen, setIsOpen] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const [fileUrlInput, setFileUrlInput] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatPlaylist, setRepeatPlaylist] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [message, setMessage] = useState("");
  const audioRef = useRef(null);
  const shouldPlayAfterChange = useRef(false);

  const tracks = settings.tracks;
  const currentTrack = tracks[currentIndex] || tracks[0] || null;
  const currentTrackId = currentTrack?.id;
  const isFolderUrlValid = useMemo(() => {
    try {
      const url = new URL(settings.folderUrl);
      return url.hostname === "drive.google.com" && /\/drive\/folders\/[\w-]+/.test(url.pathname);
    } catch {
      return false;
    }
  }, [settings.folderUrl]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error("Could not save music player settings:", error);
      setMessage("Could not save your music settings in this browser.");
    }
  }, [settings]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    if (!currentTrackId) {
      audio.removeAttribute("src");
      audio.load();
      return;
    }

    audio.src = driveAudioUrl(currentTrackId);
    audio.load();
    if (shouldPlayAfterChange.current) {
      shouldPlayAfterChange.current = false;
      audio.play().catch(() => {
        setMessage("Could not play this file. Check that Drive sharing is set to anyone with the link.");
      });
    }
  }, [currentTrackId]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const playTrack = (index) => {
    if (!tracks[index]) return;
    setMessage("");
    if (tracks[index].id === currentTrack?.id) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(() => {
          setMessage("Could not play this file. Check that Drive sharing is set to anyone with the link.");
        });
      }
      return;
    }
    shouldPlayAfterChange.current = true;
    setCurrentIndex(index);
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) {
      setMessage("Add a Google Drive audio file to start the playlist.");
      return;
    }
    if (audio.paused) {
      setMessage("");
      audio.play().catch(() => {
        setMessage("Could not play this file. Check that Drive sharing is set to anyone with the link.");
      });
    } else {
      audio.pause();
    }
  };

  const getNextIndex = () => {
    if (tracks.length < 2) return currentIndex;
    if (isShuffling) {
      const candidates = tracks.map((_, index) => index).filter((index) => index !== currentIndex);
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
    if (currentIndex + 1 < tracks.length) return currentIndex + 1;
    return repeatPlaylist ? 0 : -1;
  };

  const skipForward = () => {
    const nextIndex = getNextIndex();
    if (nextIndex === -1) {
      audioRef.current?.pause();
      return;
    }
    if (nextIndex === currentIndex && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        setMessage("Could not play this file. Check that Drive sharing is set to anyone with the link.");
      });
      return;
    }
    playTrack(nextIndex);
  };

  const skipBack = () => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    if (!tracks.length) return;
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : repeatPlaylist ? tracks.length - 1 : 0;
    playTrack(previousIndex);
  };

  const addTrack = (event) => {
    event.preventDefault();
    const fileId = driveFileIdFromUrl(fileUrlInput.trim());
    const title = titleInput.trim();
    if (!title || !fileId) {
      setMessage("Enter a song name and a valid Google Drive file link.");
      return;
    }
    if (tracks.some((track) => track.id === fileId)) {
      setMessage("That song is already in your playlist.");
      return;
    }
    setSettings((previous) => ({
      ...previous,
      tracks: [...previous.tracks, { id: fileId, title, fileUrl: fileUrlInput.trim() }],
    }));
    setTitleInput("");
    setFileUrlInput("");
    setMessage("");
  };

  const removeTrack = (index, event) => {
    event.stopPropagation();
    const removedCurrentTrack = tracks[index]?.id === currentTrack?.id;
    if (removedCurrentTrack) {
      audioRef.current?.pause();
      shouldPlayAfterChange.current = false;
    }
    setSettings((previous) => ({
      ...previous,
      tracks: previous.tracks.filter((_, trackIndex) => trackIndex !== index),
    }));
    if (index < currentIndex) setCurrentIndex((previous) => previous - 1);
    else if (removedCurrentTrack) setCurrentIndex(Math.max(0, Math.min(index, tracks.length - 2)));
    setMessage("");
  };

  const handleEnded = () => {
    const nextIndex = getNextIndex();
    if (nextIndex === -1) {
      setIsPlaying(false);
      return;
    }
    if (nextIndex === currentIndex && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        setMessage("Could not play this file. Check that Drive sharing is set to anyone with the link.");
      });
      return;
    }
    playTrack(nextIndex);
  };

  const openDriveFolder = () => {
    if (!isFolderUrlValid) {
      setMessage("Add a valid shared Google Drive folder link first.");
      return;
    }
    window.open(settings.folderUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close music player" : "Open music player"}
        className="flex shrink-0 items-center gap-2 rounded-xl border border-red-500/40 bg-[#251010] px-3 py-2.5 font-semibold text-red-100 transition hover:border-red-400 hover:bg-[#351111] focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        <FaMusic aria-hidden="true" className="text-red-400" />
        <span className="hidden sm:inline">Music</span>
        {isPlaying && <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" aria-label="Playing" />}
      </button>

      {isOpen && (
        <section
          aria-label="POS music player"
          className="fixed right-2 top-[4.5rem] z-[80] max-h-[calc(100dvh-5rem)] w-[min(24rem,calc(100vw-1rem))] overflow-y-auto rounded-2xl border border-red-950 bg-[#111] p-4 text-white shadow-2xl shadow-black/60 sm:right-4 sm:p-5"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">Store music</p>
              <h2 className="truncate text-lg font-bold">Playlist player</h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close music player"
              className="rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          <label className="mb-1 block text-sm font-semibold text-gray-200" htmlFor="music-drive-folder">
            Google Drive music folder
          </label>
          <div className="flex gap-2">
            <input
              id="music-drive-folder"
              type="url"
              value={settings.folderUrl}
              onChange={(event) => setSettings((previous) => ({ ...previous, folderUrl: event.target.value.trim() }))}
              placeholder="Paste shared folder link"
              className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#202020] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
            <button
              type="button"
              onClick={openDriveFolder}
              disabled={!isFolderUrlValid}
              title="Open your Drive folder to upload songs"
              aria-label="Open Google Drive folder"
              className="shrink-0 rounded-lg bg-red-700 px-3 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FaFolderOpen />
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            Upload songs to that folder in Google Drive, then add each song below using its share link. Set each file to
            “Anyone with the link” so it can play.
          </p>

          <form onSubmit={addTrack} className="mt-4 space-y-2 rounded-xl border border-white/10 bg-[#191919] p-3">
            <label htmlFor="music-track-title" className="block text-sm font-semibold text-gray-200">
              Add a song
            </label>
            <input
              id="music-track-title"
              value={titleInput}
              onChange={(event) => setTitleInput(event.target.value)}
              maxLength={80}
              placeholder="Song name"
              className="w-full rounded-lg border border-white/10 bg-[#101010] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none"
            />
            <input
              type="url"
              value={fileUrlInput}
              onChange={(event) => setFileUrlInput(event.target.value)}
              placeholder="Google Drive song share link"
              aria-label="Google Drive song share link"
              className="w-full rounded-lg border border-white/10 bg-[#101010] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none"
            />
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-700 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <FaPlus aria-hidden="true" /> Add to playlist
            </button>
          </form>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-200">Playlist</h3>
              <span className="text-xs text-gray-500">{tracks.length} {tracks.length === 1 ? "song" : "songs"}</span>
            </div>
            {tracks.length > 0 ? (
              <ul className="max-h-36 space-y-1 overflow-y-auto pr-1">
                {tracks.map((track, index) => (
                  <li key={track.id}>
                    <div className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${track.id === currentTrack?.id ? "bg-red-950/70" : "hover:bg-white/5"}`}>
                      <button
                        type="button"
                        onClick={() => playTrack(index)}
                        aria-label={`Play ${track.title}`}
                        className="min-w-0 flex-1 truncate py-1 text-left text-sm text-gray-100"
                      >
                        <span className="mr-2 text-red-400">{track.id === currentTrack?.id && isPlaying ? "♫" : `${index + 1}.`}</span>
                        {track.title}
                      </button>
                      <button
                        type="button"
                        onClick={(event) => removeTrack(index, event)}
                        aria-label={`Remove ${track.title}`}
                        className="rounded p-2 text-gray-400 transition hover:bg-red-950 hover:text-red-300"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg border border-dashed border-white/10 px-3 py-4 text-center text-sm text-gray-500">
                Add your first song to build the playlist.
              </p>
            )}
          </div>

          <div className="mt-4 rounded-xl bg-[#1b1b1b] p-3">
            <p className="truncate text-center text-sm font-semibold text-white">{currentTrack?.title || "No song selected"}</p>
            <div className="mt-2 flex items-center gap-2 text-[11px] tabular-nums text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={Math.min(currentTime, duration || 0)}
                onChange={(event) => {
                  const time = Number(event.target.value);
                  setCurrentTime(time);
                  if (audioRef.current) audioRef.current.currentTime = time;
                }}
                disabled={!currentTrack || !duration}
                aria-label="Song progress"
                className="h-1.5 min-w-0 flex-1 cursor-pointer accent-red-500 disabled:cursor-not-allowed"
              />
              <span>{formatTime(duration)}</span>
            </div>

            <div className="mt-2 flex items-center justify-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={() => setIsShuffling((enabled) => !enabled)}
                aria-label={isShuffling ? "Disable shuffle" : "Enable shuffle"}
                aria-pressed={isShuffling}
                className={`rounded-full p-2 transition hover:bg-white/10 ${isShuffling ? "text-red-400" : "text-gray-400"}`}
              >
                <FaRandom />
              </button>
              <button type="button" onClick={skipBack} aria-label="Previous song" className="rounded-full p-2 text-gray-100 transition hover:bg-white/10">
                <FaStepBackward />
              </button>
              <button
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? "Pause music" : "Play music"}
                className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-red-500 bg-red-700 text-lg text-white shadow-lg shadow-red-950/50 transition hover:scale-105 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                {isPlaying ? <FaPause /> : <FaPlay className="ml-0.5" />}
              </button>
              <button type="button" onClick={skipForward} aria-label="Next song" className="rounded-full p-2 text-gray-100 transition hover:bg-white/10">
                <FaStepForward />
              </button>
              <button
                type="button"
                onClick={() => setRepeatPlaylist((enabled) => !enabled)}
                aria-label={repeatPlaylist ? "Disable playlist repeat" : "Enable playlist repeat"}
                aria-pressed={repeatPlaylist}
                className={`rounded-full p-2 transition hover:bg-white/10 ${repeatPlaylist ? "text-red-400" : "text-gray-400"}`}
              >
                <FaRedo />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-2 px-2 text-gray-400">
              <FaVolumeUp aria-hidden="true" size={13} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                aria-label="Volume"
                className="h-1.5 w-full cursor-pointer accent-red-500"
              />
            </div>
          </div>

          {message && <p role="alert" className="mt-3 rounded-lg bg-red-950/80 px-3 py-2 text-xs leading-relaxed text-red-200">{message}</p>}
          <p className="mt-3 flex items-center gap-1 text-[11px] text-gray-500">
            <FaExternalLinkAlt aria-hidden="true" /> Drive must allow link access; tracks are saved only in this browser.
          </p>
          <audio
            ref={audioRef}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
            onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
            onEnded={handleEnded}
            onError={() => {
              if (currentTrack) setMessage("Google Drive could not stream this song. Check its link-sharing access and try again.");
            }}
            preload="metadata"
            className="hidden"
          />
        </section>
      )}
    </div>
  );
};

export default MusicPlayer;
