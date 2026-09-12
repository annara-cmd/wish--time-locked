import { useState } from "react";
import { Sparkles, SendHorizonal } from "lucide-react";
import { Clock } from "./Clock";
import { formatDate, formatTime } from "@/lib/time-stops";

interface StoppedTimeProps {
  stoppedAt: number;
  note: string;
  onNoteChange: (value: string) => void;
  onResume: () => void;
  leaving: boolean;
}

export function StoppedTime({
  stoppedAt,
  note,
  onNoteChange,
  onResume,
  leaving,
}: StoppedTimeProps) {
  const [wish, setWish] = useState("");
  const [wishSent, setWishSent] = useState(false);

  const sendWish = () => {
    if (!wish.trim() || wishSent) return;
    setWishSent(true);
  };

  return (
    <div
      className={`flex min-h-[100svh] flex-col items-center justify-center px-6 py-16 transition-opacity duration-1000 ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <p className="label-line reveal" style={{ animationDelay: "0.1s" }}>
        Time Stopped
      </p>

      <div className="reveal mt-10" style={{ animationDelay: "0.3s" }}>
        <Clock date={new Date(stoppedAt)} frozen />
      </div>

      <p
        className="reveal mt-12 text-center font-serif text-3xl italic text-foreground sm:text-4xl"
        style={{ animationDelay: "1.4s" }}
      >
        I will wait for you.
      </p>

      <div className="reveal mt-8 text-center" style={{ animationDelay: "2.4s" }}>
        <p className="font-serif text-2xl tabular-nums text-foreground/90">
          {formatTime(stoppedAt)}
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {formatDate(stoppedAt)}
        </p>
        <p className="mt-5 text-sm text-muted-foreground/80">This moment is yours.</p>
      </div>

      <div className="reveal mt-12 w-full max-w-md" style={{ animationDelay: "3s" }}>
        <label htmlFor="moment-note" className="label-line block text-center">
          What makes this moment worth stopping?
        </label>
        <textarea
          id="moment-note"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={3}
          placeholder="Write something you don't want to forget..."
          className="glass-field mt-4 w-full resize-none"
        />
      </div>

      <div className="reveal mt-10 w-full max-w-md" style={{ animationDelay: "3.2s" }}>
        <p className="label-line flex items-center justify-center gap-2 text-center">
          <Sparkles className="size-3.5" /> Make a wish to the angel
        </p>
        <div className="glass-field mt-4 flex items-center gap-2">
          <input
            type="text"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendWish()}
            placeholder="Whisper your wish..."
            aria-label="Make a wish to the angel"
            disabled={wishSent}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          <button
            type="button"
            onClick={sendWish}
            aria-label="Send wish"
            disabled={wishSent || !wish.trim()}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-foreground/80 transition-opacity disabled:opacity-30"
          >
            <SendHorizonal className="size-4" />
          </button>
        </div>
        {wishSent ? (
          <div className="reveal mt-4 text-center" role="status">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              The angel replies
            </p>
            <p className="mt-2 font-serif text-2xl italic text-foreground">
              Nokki irunno ippo kittum🫣
            </p>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={onResume}
        className="btn-cinema reveal mt-12"
        style={{ animationDelay: "3.3s" }}
      >
        Resume Time
      </button>
    </div>
  );
}
