import { MEMORY_POLAROIDS, MEMORY_VOICE_MEMOS } from "@/lib/landing-data";
import { seedWaveBars, MiniWaveform } from "@/components/ui/mini-waveform";

export function LandingMemories() {
  return (
    <section className="cr-landing-section cr-landing-memories cr-landing-section--fade">
      <div className="cr-landing-container cr-landing-memories-inner">
        <div className="cr-landing-polaroid-board">
          {MEMORY_POLAROIDS.map((p) => (
            <figure
              key={p.id}
              className="cr-landing-polaroid"
              style={{
                zIndex: p.z,
                width: p.width,
                transform: `rotate(${p.rotate}deg) translate(${p.offsetX}px, ${p.offsetY}px)`,
              }}
            >
              <div className="cr-landing-polaroid-tape" aria-hidden />
              <img src={p.src} alt={p.alt} className="cr-landing-polaroid-img" />
            </figure>
          ))}

          {MEMORY_VOICE_MEMOS.map((memo) => (
            <div
              key={memo.id}
              className="cr-landing-voice-memo"
              style={{
                top: memo.top,
                left: memo.left,
                transform: `rotate(${memo.rotate}deg)`,
              }}
            >
              <div className="cr-landing-voice-memo-tape" aria-hidden />
              <p className="cr-landing-voice-memo-label">{memo.label}</p>
              <p className="cr-landing-voice-memo-time">{memo.time}</p>
              <MiniWaveform
                bars={seedWaveBars(memo.waveSeed, 20)}
                accent="#3d342c"
                height="sm"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
