function VuMeter({ needle = 42 }: { needle?: number }) {
  const rotation = -48 + (needle / 100) * 96;
  return (
    <div className="cr-vu-meter">
      <svg viewBox="0 0 120 72" className="cr-vu-svg" aria-hidden>
        <defs>
          <linearGradient id="vuFace" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(30 12% 14%)" />
            <stop offset="100%" stopColor="hsl(25 10% 8%)" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="112" height="64" rx="8" fill="url(#vuFace)" stroke="hsl(30 8% 22%)" strokeWidth="1" />
        <path
          d="M 18 58 A 42 42 0 0 1 102 58"
          fill="none"
          stroke="hsl(30 8% 28%)"
          strokeWidth="1"
        />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = Math.PI + (i / 5) * Math.PI;
          const x1 = 60 + Math.cos(a) * 34;
          const y1 = 58 + Math.sin(a) * 34;
          const x2 = 60 + Math.cos(a) * 40;
          const y2 = 58 + Math.sin(a) * 40;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i >= 4 ? "hsl(0 70% 55%)" : "hsl(42 50% 45%)"}
              strokeWidth="1"
            />
          );
        })}
        <g transform={`rotate(${rotation} 60 58)`}>
          <line x1="60" y1="58" x2="60" y2="22" stroke="hsl(35 80% 72%)" strokeWidth="2" strokeLinecap="round" />
          <circle cx="60" cy="58" r="4" fill="hsl(30 15% 20%)" stroke="hsl(42 40% 50%)" />
        </g>
      </svg>
    </div>
  );
}

function TapeReels() {
  return (
    <div className="cr-tape-reels" aria-hidden>
      <div className="cr-tape-reel cr-tape-reel--spin">
        <div className="cr-tape-reel-hub" />
        <div className="cr-tape-reel-ring" />
      </div>
      <div className="cr-tape-bridge" />
      <div className="cr-tape-reel cr-tape-reel--spin-reverse">
        <div className="cr-tape-reel-hub" />
        <div className="cr-tape-reel-ring" />
      </div>
    </div>
  );
}

export function TapeRecorder() {
  return (
    <div className="cr-tape-recorder">
      <p className="cr-mixer-section-label">Tape recorder</p>
      <div className="cr-tape-face">
        <div className="cr-vu-row">
          <VuMeter needle={38} />
          <VuMeter needle={52} />
        </div>
        <TapeReels />
        <div className="cr-tape-transport">
          <button type="button" className="cr-transport-btn" aria-label="Stop">
            <span className="cr-transport-stop" />
          </button>
          <button type="button" className="cr-transport-btn cr-transport-btn--record" aria-label="Record">
            <span className="cr-transport-record" />
          </button>
          <button type="button" className="cr-transport-btn" aria-label="Play">
            <span className="cr-transport-play" />
          </button>
        </div>
      </div>
    </div>
  );
}
