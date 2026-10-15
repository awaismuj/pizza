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
      <div className="flex min-w-0 shrink-0 items-center gap-0.5 rounded-xl border border-red-500/40 bg-[#251010] p-1 text-red-100 sm:gap-1">
        <FaMusic aria-hidden="true" className="mx-1 hidden text-red-400 sm:block" />
        <button
          type="button"
          onClick={skipBack}
          aria-label="Previous song"
          title="Previous song"
          className="rounded-lg p-2 transition hover:bg-white/10"
        >
          <FaStepBackward size={12} />
        </button>
        <button
          type="button"
          onClick={togglePlayback}
          aria-label={isPlaying ? "Pause music" : "Play music"}
          title={currentTrack?.title || "Play music"}
          className="rounded-lg p-2 text-red-400 transition hover:bg-white/10"
        >
          {isPlaying ? <FaPause size={13} /> : <FaPlay size={13} />}
        </button>
        <button
          type="button"
          onClick={skipForward}
          aria-label="Next song"
          title="Next song"
          className="rounded-lg p-2 transition hover:bg-white/10"
        >
          <FaStepForward size={12} />
        </button>
        {canManage && (
          <button
            type="button"
            onClick={() => navigate("/dashboard?tab=Music")}
            aria-label="Manage store music"
            title="Manage store music"
            className="ml-0.5 rounded-lg bg-red-700 px-2.5 py-2 text-xs font-bold text-white transition hover:bg-red-600"
          >
            <span className="hidden sm:inline">Music</span>
            <FaMusic aria-hidden="true" className="sm:hidden" />
          </button>
        )}
        {isPlaying && <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-red-500" aria-label="Playing" />}
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
    <section aria-label="POS music playlist manager" className="mx-auto w-full max-w-5xl px-4 pb-8 sm:px-6">
      <div className="rounded-2xl border border-red-950 bg-[#111] p-4 text-white shadow-xl shadow-black/20 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="rounded-xl bg-red-950 p-3 text-red-400"><FaMusic size={20} /></span>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">Store music</p>
              <h2 className="text-xl font-bold sm:text-2xl">Playlist manager</h2>
              <p className="mt-1 max-w-xl text-sm text-gray-400">Add your shared songs and control music playing across the POS.</p>
            </div>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-gray-400">
            {tracks.length} {tracks.length === 1 ? "song" : "songs"}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-[#191919] p-4">
              <label className="mb-2 block text-sm font-semibold text-gray-200" htmlFor="music-drive-folder">
                Google Drive music folder
              </label>
              <div className="flex gap-2">
                <input
                  id="music-drive-folder"
                  type="url"
                  value={settings.folderUrl}
                  onChange={(event) => updateFolderUrl(event.target.value.trim())}
                  placeholder="Paste shared folder link"
                  className="min-w-0 flex-1 rounded-lg border border-white/10 bg-[#202020] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  type="button"
                  onClick={openDriveFolder}
                  disabled={!isValidFolderUrl(settings.folderUrl)}
                  title="Open your Drive folder to upload songs"
                  aria-label="Open Google Drive folder"
                  className="shrink-0 rounded-lg bg-red-700 px-4 text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <FaFolderOpen />
                </button>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                Upload songs to this folder, then add each song below using its file share link. Set each file to “Anyone with the link”.
              </p>
            </div>

            <form onSubmit={submitTrack} className="space-y-3 rounded-xl border border-white/10 bg-[#191919] p-4">
              <h3 className="text-sm font-bold text-gray-200">Add a song</h3>
              <input
                value={titleInput}
                onChange={(event) => setTitleInput(event.target.value)}
                maxLength={80}
                placeholder="Song name"
                aria-label="Song name"
                className="w-full rounded-lg border border-white/10 bg-[#101010] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none"
              />
              <input
                type="url"
                value={fileUrlInput}
                onChange={(event) => setFileUrlInput(event.target.value)}
                placeholder="Google Drive song share link"
                aria-label="Google Drive song share link"
                className="w-full rounded-lg border border-white/10 bg-[#101010] px-3 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-red-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-700 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <FaPlus aria-hidden="true" /> Add to playlist
              </button>
            </form>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#191919] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-gray-200">Playlist</h3>
              <span className="text-xs text-gray-500">{tracks.length} {tracks.length === 1 ? "song" : "songs"}</span>
            </div>
            {tracks.length > 0 ? (
              <ul className="max-h-64 space-y-1 overflow-y-auto pr-1">
                {tracks.map((track, index) => (
                  <li key={track.id} className={`flex min-w-0 items-center gap-2 rounded-lg px-2 ${track.id === currentTrack?.id ? "bg-red-950/70" : "hover:bg-white/5"}`}>
                    <button
                      type="button"
                      onClick={() => playTrack(index)}
                      aria-label={`Play ${track.title}`}
                      className="min-w-0 flex-1 truncate py-3 text-left text-sm text-gray-100"
                    >
                      <span className="mr-2 text-red-400">{track.id === currentTrack?.id && isPlaying ? "♫" : `${index + 1}.`}</span>
                      {track.title}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTrack(index)}
                      aria-label={`Remove ${track.title}`}
                      className="rounded p-2 text-gray-400 transition hover:bg-red-950 hover:text-red-300"
                    >
                      <FaTrash size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="rounded-lg border border-dashed border-white/10 px-3 py-8 text-center text-sm text-gray-500">
                Add your first song to build the playlist.
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-[#1b1b1b] p-4 sm:p-5">
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
                if (player.audioRef.current) player.audioRef.current.currentTime = time;
              }}
              disabled={!currentTrack || !duration}
              aria-label="Song progress"
              className="h-1.5 min-w-0 flex-1 cursor-pointer accent-red-500 disabled:cursor-not-allowed"
            />
            <span>{formatTime(duration)}</span>
          </div>

          <div className="mt-3 flex items-center justify-center gap-3 sm:gap-6">
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
          <div className="mx-auto mt-3 flex max-w-xs items-center gap-2 px-2 text-gray-400">
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

        {message && <p role="alert" className="mt-3 rounded-lg bg-red-950/80 px-3 py-2 text-sm leading-relaxed text-red-200">{message}</p>}
        <p className="mt-3 flex items-start gap-1 text-xs text-gray-500">
          <FaExternalLinkAlt aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>Drive must allow link access. Playlist settings are saved only in this browser. If Drive will not stream a file, host the audio on your site instead.</span>
        </p>
      </div>
    </section>
  );
};

export default MusicPlayer;
