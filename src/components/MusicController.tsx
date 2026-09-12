import { useEffect, useRef } from "react";
import { Volume2, VolumeX } from "lucide-react";
import waitTune from "@/assets/wait-tune.mp3.asset.json";

interface MusicControllerProps {
  playing: boolean;
  muted: boolean;
  onToggleMute: () => void;
  visible: boolean;
}

const SRC = waitTune.url;
const TARGET_VOLUME = 0.55;

export function MusicController({ playing, muted, onToggleMute, visible }: MusicControllerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeRef.current) window.clearInterval(fadeRef.current);

    const target = playing && !muted ? TARGET_VOLUME : 0;

    if (playing && !muted && audio.paused) {
      audio.volume = 0;
      void audio.play().catch(() => undefined);
    }

    fadeRef.current = window.setInterval(() => {
      const diff = target - audio.volume;
      if (Math.abs(diff) < 0.02) {
        audio.volume = target;
        if (target === 0) audio.pause();
        if (fadeRef.current) window.clearInterval(fadeRef.current);
        fadeRef.current = null;
        return;
      }
      audio.volume = Math.min(1, Math.max(0, audio.volume + diff * 0.12));
    }, 60);

    return () => {
      if (fadeRef.current) window.clearInterval(fadeRef.current);
    };
  }, [playing, muted]);

  useEffect(() => {
    if (!playing && audioRef.current) audioRef.current.currentTime = 0;
  }, [playing]);

  return (
    <>
      <audio ref={audioRef} src={SRC} loop preload="none" />
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? "Unmute music" : "Mute music"}
        aria-pressed={muted}
        className={`glass-pill fixed right-5 top-5 z-30 inline-flex size-11 items-center justify-center transition-opacity duration-700 ${
          visible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
      </button>
    </>
  );
}
