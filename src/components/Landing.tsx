import { Clock } from "./Clock";

interface LandingProps {
  now: Date;
  onStop: () => void;
  dimmed: boolean;
}

export function Landing({ now, onStop, dimmed }: LandingProps) {
  return (
    <div
      className={`flex min-h-[100svh] flex-col items-center justify-center px-6 py-16 transition-opacity duration-700 ${
        dimmed ? "opacity-0" : "opacity-100"
      }`}
    >
      <header className="text-center">
        <h1 className="font-serif text-5xl tracking-[0.18em] text-foreground sm:text-6xl">
          TIME STOPS
        </h1>
        <p className="label-line mt-5">Everyone says time stops for no one</p>
        <p className="mt-4 font-serif text-xl italic text-foreground/70 sm:text-2xl">
          But here, it stops for you.
        </p>
      </header>

      <div className="mt-12 sm:mt-14">
        <Clock date={now} />
      </div>

      <button type="button" onClick={onStop} className="btn-cinema mt-14">
        Stop Time
      </button>
    </div>
  );
}
