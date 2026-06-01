import { useId } from "react";

function VuMeter({ needle = 42 }: { needle?: number }) {
  const uid = useId().replace(/:/g, "");
  const faceId = `vuFace-${uid}`;
  const glassId = `vuGlass-${uid}`;
  const bezelId = `vuBezel-${uid}`;
  const rotation = -48 + (needle / 100) * 96;

  return (
    <div className="cr-vu-meter">
      <div className="cr-vu-meter-bezel">
        <svg viewBox="0 0 120 88" className="cr-vu-svg" aria-hidden>
          <defs>
            <linearGradient id={faceId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(32 14% 16%)" />
              <stop offset="55%" stopColor="hsl(28 12% 10%)" />
              <stop offset="100%" stopColor="hsl(24 10% 7%)" />
            </linearGradient>
            <linearGradient id={glassId} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 232, 198, 0.28)" />
              <stop offset="38%" stopColor="rgba(255, 220, 175, 0.1)" />
              <stop offset="100%" stopColor="rgba(255, 210, 160, 0)" />
            </linearGradient>
            <linearGradient id={bezelId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 235, 200, 0.35)" />
              <stop offset="50%" stopColor="rgba(120, 108, 98, 0.15)" />
              <stop offset="100%" stopColor="rgba(40, 36, 32, 0.5)" />
            </linearGradient>
          </defs>
          <rect
            x="2"
            y="2"
            width="116"
            height="72"
            rx="10"
            fill={`url(#${faceId})`}
            stroke="rgba(255,225,180,0.14)"
            strokeWidth="1"
          />
          <rect
            x="3"
            y="3"
            width="114"
            height="70"
            rx="9"
            fill="none"
            stroke={`url(#${bezelId})`}
            strokeWidth="1.5"
          />
          <path
            d="M 16 60 A 44 44 0 0 1 104 60"
            fill="none"
            stroke="rgba(255,225,180,0.08)"
            strokeWidth="1"
          />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = Math.PI + (i / 5) * Math.PI;
            const x1 = 60 + Math.cos(a) * 36;
            const y1 = 60 + Math.sin(a) * 36;
            const x2 = 60 + Math.cos(a) * 42;
            const y2 = 60 + Math.sin(a) * 42;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i >= 4 ? "hsl(18 55% 48%)" : "hsl(38 35% 52%)"}
                strokeWidth="1"
                opacity={0.85}
              />
            );
          })}
          <g transform={`rotate(${rotation} 60 60)`}>
            <line
              x1="60"
              y1="60"
              x2="60"
              y2="20"
              stroke="hsl(40 45% 82%)"
              strokeWidth="2.25"
              strokeLinecap="round"
            />
            <circle
              cx="60"
              cy="60"
              r="4.5"
              fill="hsl(28 12% 14%)"
              stroke="rgba(255,225,180,0.35)"
              strokeWidth="1"
            />
          </g>
          <rect x="4" y="4" width="112" height="34" rx="8" fill={`url(#${glassId})`} />
          <rect
            x="8"
            y="76"
            width="104"
            height="6"
            rx="2"
            fill="rgba(0,0,0,0.35)"
            opacity="0.5"
          />
        </svg>
      </div>
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
      <p className="cr-mixer-section-label cr-mixer-label-engraved">Tape recorder</p>
      <div className="cr-tape-frame">
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
    </div>
  );
}
