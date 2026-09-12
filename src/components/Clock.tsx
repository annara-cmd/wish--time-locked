interface ClockProps {
  /** Date to render. When frozen, this value never changes. */
  date: Date;
  frozen?: boolean;
}

export function Clock({ date, frozen = false }: ClockProps) {
  const ms = date.getMilliseconds();
  const s = date.getSeconds() + ms / 1000;
  const m = date.getMinutes() + s / 60;
  const h = (date.getHours() % 12) + m / 60;

  const secondDeg = s * 6;
  const minuteDeg = m * 6;
  const hourDeg = h * 30;

  return (
    <div
      className={`clock-shell relative aspect-square w-[min(78vw,26rem)] ${frozen ? "is-frozen" : ""}`}
      role="img"
      aria-label={`Analogue clock showing ${date.toLocaleTimeString()}`}
    >
      <svg viewBox="0 0 200 200" className="size-full overflow-visible">
        <defs>
          <radialGradient id="dial" cx="50%" cy="42%" r="70%">
            <stop offset="0%" stopColor="var(--dial-inner)" />
            <stop offset="100%" stopColor="var(--dial-outer)" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="94" fill="url(#dial)" />
        <circle
          cx="100"
          cy="100"
          r="94"
          fill="none"
          stroke="var(--color-rim)"
          strokeWidth="0.8"
        />
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="var(--color-rim)"
          strokeWidth="0.3"
          opacity="0.6"
        />

        {Array.from({ length: 60 }).map((_, i) => {
          const major = i % 5 === 0;
          return (
            <line
              key={i}
              x1="100"
              y1={major ? 14 : 17}
              x2="100"
              y2={major ? 24 : 20}
              stroke="var(--color-tick)"
              strokeWidth={major ? 1.4 : 0.5}
              opacity={major ? 0.9 : 0.4}
              strokeLinecap="round"
              transform={`rotate(${i * 6} 100 100)`}
            />
          );
        })}

        {Array.from({ length: 12 }).map((_, i) => {
          const angle = ((i + 1) * 30 - 90) * (Math.PI / 180);
          return (
            <text
              key={i}
              x={100 + Math.cos(angle) * 68}
              y={100 + Math.sin(angle) * 68}
              textAnchor="middle"
              dominantBaseline="central"
              className="clock-numeral"
            >
              {i + 1}
            </text>
          );
        })}

        <g className="hand hand-hour" style={{ transform: `rotate(${hourDeg}deg)` }}>
          <line x1="100" y1="112" x2="100" y2="52" strokeLinecap="round" strokeWidth="4.5" />
        </g>
        <g className="hand hand-minute" style={{ transform: `rotate(${minuteDeg}deg)` }}>
          <line x1="100" y1="116" x2="100" y2="30" strokeLinecap="round" strokeWidth="2.6" />
        </g>
        <g className="hand hand-second" style={{ transform: `rotate(${secondDeg}deg)` }}>
          <line x1="100" y1="122" x2="100" y2="24" strokeLinecap="round" strokeWidth="0.9" />
          <circle cx="100" cy="100" r="3.2" />
        </g>
        <circle cx="100" cy="100" r="1.2" fill="var(--dial-inner)" />
      </svg>
    </div>
  );
}
