import type { Moment } from "@/lib/time-stops";
import { formatDate, formatDuration, formatTime } from "@/lib/time-stops";

export function TimeCapsule({ moments }: { moments: Moment[] }) {
  return (
    <section aria-labelledby="capsule-heading" className="mx-auto w-full max-w-2xl px-6 pb-32 pt-24">
      <h2 id="capsule-heading" className="label-line text-center">
        Time Capsule
      </h2>

      {moments.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="font-serif text-2xl text-foreground/85">You haven't stopped time yet.</p>
          <p className="mt-3 text-sm text-muted-foreground">
            Maybe there's a moment waiting for you.
          </p>
        </div>
      ) : (
        <ul className="mt-12 space-y-px">
          {moments.map((m) => (
            <li key={m.id} className="hairline-row py-7">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {formatDate(m.stoppedAt)}
              </p>
              <p className="mt-3 font-serif text-3xl tabular-nums text-foreground">
                {formatTime(m.stoppedAt)}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Stopped for {formatDuration(m.frozenDuration)} · resumed at{" "}
                {formatTime(m.resumedAt)}
              </p>
              {m.note ? (
                <p className="mt-4 font-serif text-lg italic text-foreground/80">“{m.note}”</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
