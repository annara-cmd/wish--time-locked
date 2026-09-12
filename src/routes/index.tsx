import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { Landing } from "@/components/Landing";
import { StoppedTime } from "@/components/StoppedTime";
import { TimeCapsule } from "@/components/TimeCapsule";
import { MusicController } from "@/components/MusicController";
import {
  formatDuration,
  loadMoments,
  saveMoment,
  type Moment,
} from "@/lib/time-stops";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TIME STOPS — But here, it stops for you" },
      {
        name: "description",
        content:
          "A cinematic, emotional experience: stop time on a living analogue clock, keep the moment, and let it say — I will wait for you.",
      },
      { property: "og:title", content: "TIME STOPS — But here, it stops for you" },
      {
        property: "og:description",
        content:
          "Stop time on a living analogue clock and keep the moment in your own time capsule.",
      },
    ],
  }),
  component: TimeStops,
});

type Phase = "running" | "stopped" | "resumed";

function TimeStops() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [phase, setPhase] = useState<Phase>("running");
  const [transitioning, setTransitioning] = useState(false);
  const [stoppedAt, setStoppedAt] = useState<number | null>(null);
  const [lastDuration, setLastDuration] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [muted, setMuted] = useState(false);
  const [moments, setMoments] = useState<Moment[]>([]);
  const startedAtRef = useRef<number>(Date.now());

  useEffect(() => {
    setMounted(true);
    setMoments(loadMoments());
  }, []);

  useEffect(() => {
    if (phase !== "stopped" || muted) return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const timer = window.setTimeout(() => {
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(
        "Time has stopped for you. Don't worry. I will wait for you."
      );
      utter.rate = 0.9;
      utter.pitch = 1;
      utter.volume = 1;
      synth.speak(utter);
    }, 1600);
    return () => {
      window.clearTimeout(timer);
      synth.cancel();
    };
  }, [phase, muted]);

  useEffect(() => {
    if (phase === "stopped") return;
    let raf = 0;
    const tick = () => {
      setNow(new Date());
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const handleStop = useCallback(() => {
    const ts = Date.now();
    startedAtRef.current = ts;
    setTransitioning(true);
    window.setTimeout(() => {
      setStoppedAt(ts);
      setNote("");
      setPhase("stopped");
      setTransitioning(false);
    }, 700);
  }, []);

  const handleResume = useCallback(() => {
    if (stoppedAt == null) return;
    const resumedAt = Date.now();
    const frozenDuration = resumedAt - stoppedAt;
    setTransitioning(true);
    const moment: Moment = {
      id: `${stoppedAt}`,
      startedAt: startedAtRef.current,
      stoppedAt,
      resumedAt,
      frozenDuration,
      note: note.trim(),
    };
    setMoments(saveMoment(moment));
    setLastDuration(frozenDuration);
    window.setTimeout(() => {
      setNow(new Date());
      setPhase("resumed");
      setTransitioning(false);
      window.setTimeout(() => setPhase("running"), 4200);
    }, 1000);
  }, [note, stoppedAt]);

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-background">
      <div className="aurora" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <MusicController
        playing={phase === "stopped"}
        muted={muted}
        onToggleMute={() => setMuted((m) => !m)}
        visible={phase === "stopped"}
      />

      <div className="relative z-10">
        {phase === "stopped" && stoppedAt != null ? (
          <StoppedTime
            stoppedAt={stoppedAt}
            note={note}
            onNoteChange={setNote}
            onResume={handleResume}
            leaving={transitioning}
          />
        ) : (
          <div className="relative">
            {mounted ? (
              <Landing now={now} onStop={handleStop} dimmed={transitioning} />
            ) : (
              <div className="min-h-[100svh]" />
            )}

            {phase === "resumed" && lastDuration != null ? (
              <div
                className="pointer-events-none fixed inset-x-0 bottom-10 z-20 flex flex-col items-center"
                role="status"
              >
                <p className="label-line reveal">Time Resumed</p>
                <p className="reveal mt-2 font-serif text-xl tabular-nums text-foreground/85">
                  You stopped time for {formatDuration(lastDuration)}
                </p>
              </div>
            ) : null}
          </div>
        )}

        {phase !== "stopped" ? <TimeCapsule moments={moments} /> : null}
      </div>
    </main>
  );
}
