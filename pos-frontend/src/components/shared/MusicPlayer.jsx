import { useState } from "react";
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
  FaTrash,
  FaVolumeUp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMusicPlayer } from "./MusicPlayerContext";

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainder}`;
};

const isValidFolderUrl = (value) => {
  try {
    const url = new URL(value);
    return url.hostname === "drive.google.com" && /\/drive\/folders\/[\w-]+/.test(url.pathname);
  } catch {
    return false;
  }
};

const MusicPlayer = ({ variant = "compact", canManage = false }) => {
  const navigate = useNavigate();
  const [titleInput, setTitleInput] = useState("");
  const [fileUrlInput, setFileUrlInput] = useState("");
  const player = useMusicPlayer();
  const {
    settings,
    tracks,
    currentTrack,
    currentIndex,
    isPlaying,
    isShuffling,
    setIsShuffling,
    repeatPlaylist,
    setRepeatPlaylist,
    currentTime,
    setCurrentTime,
    duration,
    volume,
    setVolume,
    message,
    setMessage,
    playTrack,
    togglePlayback,
    skipForward,
    skipBack,
    addTrack,
    removeTrack,
    updateFolderUrl,
  } = player;

  if (variant === "compact") {
    return (
      <div className="flex min-w-0 shrink-0 items-center justify-between gap-0.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-1 text-slate-700 dark:text-slate-300 shadow-xs sm:gap-1">
        <div className="flex items-center gap-0.5">
          <FaMusic aria-hidden="true" className="mx-1.5 hidden text-amber-500 sm:block text-xs" />
          <button
            type="button"
            onClick={skipBack}
            aria-label="Previous song"
            title="Previous song"
            className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <FaStepBackward size={11} />
          </button>
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            title={currentTrack?.title || "Play music"}
            className="rounded-lg p-1.5 text-amber-500 transition hover:bg-amber-500/10"
          >
            {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
          </button>
          <button
            type="button"
            onClick={skipForward}
            aria-label="Next song"
            title="Next song"
            className="rounded-lg p-1.5 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
          >
            <FaStepForward size={11} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {isPlaying && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-label="Playing" />}
          {canManage && (
            <button
              type="button"
              onClick={() => navigate("/dashboard?tab=Music")}
              aria-label="Manage store music"
              title="Manage store music"
              className="rounded-lg bg-amber-500 px-2 py-1 text-[11px] font-bold text-slate-950 transition hover:bg-amber-400"
            >
              <span className="hidden sm:inline">Music</span>
              <FaMusic aria-hidden="true" className="sm:hidden text-xs" />
            </button>
          )}
        </div>
      </div>
    );
  }

  const openDriveFolder = () => {
    if (!isValidFolderUrl(settings.folderUrl)) {
      setMessage("Add a valid shared Google Drive folder link first.");
      return;
    }
    window.open(settings.folderUrl, "_blank", "noopener,noreferrer");
  };

  const submitTrack = (event) => {
    event.preventDefault();
    if (addTrack(titleInput, fileUrlInput)) {
      setTitleInput("");
      setFileUrlInput("");
    }
  };

  return (
    <section aria-label="POS music playlist manager" className="mx-auto w-full max-w-5xl px-2 pb-8 sm:px-4">
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-7 text-slate-800 dark:text-slate-100 shadow-xs">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-5">
          <div className="flex items-start gap-3.5">
            <span className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-3 text-amber-600 dark:text-amber-400">
              <FaMusic size={22} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">Store Music</p>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">Playlist Manager</h2>
              <p className="mt-1 max-w-xl text-sm text-slate-500 dark:text-slate-400">
                Add shared tracks and control background ambiance across all POS stations.
              </p>
            </div>
          </div>
          <span className="rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
            {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 sm:p-5">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300" htmlFor="music-drive-folder">
                Google Drive Music Folder
              </label>
              <div className="flex gap-2">
                <input
                  id="music-drive-folder"
                  type="url"
                  value={settings.folderUrl}
                  onChange={(event) => updateFolderUrl(event.target.value.trim())}
                  placeholder="Paste shared folder link"
                  className="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={openDriveFolder}
                  disabled={!isValidFolderUrl(settings.folderUrl)}
                  title="Open your Drive folder to upload songs"
                  aria-label="Open Google Drive folder"
                  className="shrink-0 rounded-xl bg-amber-500 px-4 text-slate-950 font-bold transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 shadow-xs flex items-center justify-center"
                >
                  <FaFolderOpen size={16} />
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                Upload songs to this Google Drive folder, then add each track below using its shareable link. Set files to <strong className="font-semibold text-slate-700 dark:text-slate-200">"Anyone with the link"</strong>.
              </p>
            </div>

            <form onSubmit={submitTrack} className="space-y-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 sm:p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Add a Track</h3>
              <input
                value={titleInput}
                onChange={(event) => setTitleInput(event.target.value)}
                maxLength={80}
                placeholder="Song title (e.g. Chill Pizza Beats)"
                aria-label="Song title"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
              />
              <input
                type="url"
                value={fileUrlInput}
                onChange={(event) => setFileUrlInput(event.target.value)}
                placeholder="Google Drive song share link"
                aria-label="Google Drive song share link"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition"
              />
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-amber-400 active:scale-[0.99] shadow-xs"
              >
                <FaPlus aria-hidden="true" size={13} /> Add to playlist
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 sm:p-5 flex flex-col">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">Playlist Queue</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{tracks.length} {tracks.length === 1 ? "track" : "tracks"}</span>
            </div>
            {tracks.length > 0 ? (
              <ul className="max-h-72 space-y-1.5 overflow-y-auto pr-1 flex-1">
                {tracks.map((track, index) => (
                  <li
                    key={track.id}
                    className={`flex min-w-0 items-center gap-2 rounded-xl px-3 py-2 transition ${
                      track.id === currentTrack?.id
                        ? "bg-amber-500/15 border border-amber-500/30 text-amber-900 dark:text-amber-300 font-semibold"
                        : "bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => playTrack(index)}
                      aria-label={`Play ${track.title}`}
                      className="min-w-0 flex-1 truncate text-left text-sm py-1"
                    >
                      <span className="mr-2 text-red-400">{track.id === currentTrack?.id && isPlaying ? "•" : `${index + 1}.`}</span>
                      {track.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTrack(index)}
                      aria-label={`Remove ${track.title}`}
                      className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400"
                    >
                      <FaTrash size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 px-4 py-10 text-center">
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Add your first track using the form on the left to start building your store playlist.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 p-5">
          <p className="truncate text-center text-sm font-bold text-slate-900 dark:text-white">
            {currentTrack?.title || "No song selected"}
          </p>
          <div className="mt-3 flex items-center gap-3 text-xs tabular-nums text-slate-500 dark:text-slate-400">
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
                if (player.audioRef.current) player.audioRef.current.currentTime = time;
              }}
              disabled={!currentTrack || !duration}
              aria-label="Song progress"
              className="h-2 min-w-0 flex-1 cursor-pointer accent-amber-500 disabled:cursor-not-allowed"
            />
            <span>{formatTime(duration)}</span>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => setIsShuffling((enabled) => !enabled)}
              aria-label={isShuffling ? "Disable shuffle" : "Enable shuffle"}
              aria-pressed={isShuffling}
              className={`rounded-full p-2.5 transition hover:bg-slate-200/70 dark:hover:bg-slate-700 ${
                isShuffling ? "text-amber-500 font-bold" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              <FaRandom size={15} />
            </button>
            <button
              type="button"
              onClick={skipBack}
              aria-label="Previous song"
              className="rounded-full p-2.5 text-slate-700 dark:text-slate-200 transition hover:bg-slate-200/70 dark:hover:bg-slate-700"
            >
              <FaStepBackward size={16} />
            </button>
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause music" : "Play music"}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 text-slate-950 text-base font-bold shadow-md shadow-amber-500/25 transition hover:scale-105 hover:bg-amber-400 active:scale-95"
            >
              {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} className="ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={skipForward}
              aria-label="Next song"
              className="rounded-full p-2.5 text-slate-700 dark:text-slate-200 transition hover:bg-slate-200/70 dark:hover:bg-slate-700"
            >
              <FaStepForward size={16} />
            </button>
            <button
              type="button"
              onClick={() => setRepeatPlaylist((enabled) => !enabled)}
              aria-label={repeatPlaylist ? "Disable playlist repeat" : "Enable playlist repeat"}
              aria-pressed={repeatPlaylist}
              className={`rounded-full p-2.5 transition hover:bg-slate-200/70 dark:hover:bg-slate-700 ${
                repeatPlaylist ? "text-amber-500 font-bold" : "text-slate-400 dark:text-slate-500"
              }`}
            >
              <FaRedo size={15} />
            </button>
          </div>
          <div className="mx-auto mt-4 flex max-w-xs items-center gap-2.5 px-2 text-slate-400 dark:text-slate-500">
            <FaVolumeUp aria-hidden="true" size={14} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(event) => setVolume(Number(event.target.value))}
              aria-label="Volume"
              className="h-2 w-full cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {message && (
          <p role="alert" className="mt-4 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 text-xs font-medium leading-relaxed text-amber-700 dark:text-amber-300">
            {message}
          </p>
        )}
        <p className="mt-4 flex items-start gap-1.5 text-xs text-slate-400 dark:text-slate-500">
          <FaExternalLinkAlt aria-hidden="true" className="mt-0.5 shrink-0" size={11} />
          <span>Google Drive must allow link access ("Anyone with the link can view"). Settings are remembered locally. If Google Drive will not stream a track, direct audio hosting is recommended.</span>
        </p>
      </div>
    </section>
  );
};

export default MusicPlayer;
