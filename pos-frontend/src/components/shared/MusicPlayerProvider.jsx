import { useEffect, useRef, useState } from "react";
import { MusicPlayerContext } from "./MusicPlayerContext";
import { axiosWrapper } from "../../https/axiosWrapper";

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

const MusicPlayerProvider = ({ children }) => {
  const [settings, setSettings] = useState(readSettings);
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

    audio.crossOrigin = "use-credentials";
    audio.src = `${axiosWrapper.defaults.baseURL.replace(/\/$/, "")}/api/music/${encodeURIComponent(currentTrackId)}`;
    audio.load();
    if (shouldPlayAfterChange.current) {
      shouldPlayAfterChange.current = false;
      audio.play().catch(reportPlaybackFailure);
    }
  }, [currentTrackId]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const reportPlaybackFailure = (error) => {
    console.error("Music playback failed:", error);
    if (error.name === "NotAllowedError") {
      setMessage("Your browser blocked playback. Press Play again to start the song.");
      return;
    }
    setMessage("Could not stream this song. Check that you are signed in, the POS backend is updated, and the Drive file is public.");
  };

  const playTrack = (index) => {
    if (!tracks[index]) return;
    setMessage("");
    if (tracks[index].id === currentTrack?.id) {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        audio.play().catch(reportPlaybackFailure);
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
      audio.play().catch(reportPlaybackFailure);
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
      audioRef.current.play().catch(reportPlaybackFailure);
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

  const addTrack = (titleValue, fileUrlValue) => {
    const fileUrl = fileUrlValue.trim();
    const fileId = driveFileIdFromUrl(fileUrl);
    const title = titleValue.trim();
    if (!title || !fileId) {
      setMessage("Enter a song name and a valid Google Drive file link.");
      return false;
    }
    if (tracks.some((track) => track.id === fileId)) {
      setMessage("That song is already in your playlist.");
      return false;
    }
    setSettings((previous) => ({
      ...previous,
      tracks: [...previous.tracks, { id: fileId, title, fileUrl }],
    }));
    setMessage("");
    return true;
  };

  const removeTrack = (index) => {
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
      audioRef.current.play().catch(reportPlaybackFailure);
      return;
    }
    playTrack(nextIndex);
  };

  const updateFolderUrl = (folderUrl) => {
    setSettings((previous) => ({ ...previous, folderUrl }));
    setMessage("");
  };

  const value = {
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
    audioRef,
    playTrack,
    togglePlayback,
    skipForward,
    skipBack,
    addTrack,
    removeTrack,
    handleEnded,
    updateFolderUrl,
    setIsPlaying,
    setDuration,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={handleEnded}
        onError={(event) => {
          if (currentTrack) {
            const code = event.currentTarget.error?.code;
            setMessage(
              code === 3 || code === 4
                ? "This file format is not supported. Try MP3, WAV, AAC, or OGG."
                : "Could not stream this song. Check your sign-in, backend connection, and the file's Drive sharing."
            );
          }
        }}
        preload="metadata"
        className="hidden"
      />
    </MusicPlayerContext.Provider>
  );
};

export default MusicPlayerProvider;
