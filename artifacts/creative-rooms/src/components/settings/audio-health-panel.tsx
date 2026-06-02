import { CheckCircle2 } from "lucide-react";
import { seedWaveBars, MiniWaveform } from "@/components/ui/mini-waveform";
import type { MeterStatus } from "@/lib/settings-demo-data";
import { cn } from "@/lib/utils";

interface AudioHealthPanelProps {
  inputStatus: MeterStatus;
  outputStatus: MeterStatus;
}

export function AudioHealthPanel({ inputStatus, outputStatus }: AudioHealthPanelProps) {
  const allGood = inputStatus === "Good" && outputStatus === "Good";

  return (
    <section className="cr-settings-rail-card">
      <h3 className="cr-settings-rail-title">Your audio at a glance</h3>

      <div className="cr-settings-health-status">
        <CheckCircle2
          className={cn(
            "w-5 h-5 shrink-0",
            allGood ? "text-[#6eb88a]" : "text-[#d8aa72]",
          )}
        />
        <div>
          <p className="cr-settings-health-headline">
            {allGood ? "Everything looks good!" : "A quick tweak might help"}
          </p>
          <p className="cr-settings-health-sub">
            {allGood ? "You're ready to create." : "Check levels or run a test."}
          </p>
        </div>
      </div>

      <div className="cr-settings-health-wave">
        <MiniWaveform
          bars={seedWaveBars(42, 36)}
          accent="#d8aa72"
          active={allGood}
          height="md"
        />
      </div>

      <ul className="cr-settings-health-signals">
        <li>
          <span>Input</span>
          <span className={signalClass(inputStatus)}>{inputStatus} signal</span>
        </li>
        <li>
          <span>Output</span>
          <span className={signalClass(outputStatus)}>{outputStatus} signal</span>
        </li>
      </ul>
    </section>
  );
}

function signalClass(status: MeterStatus): string {
  if (status === "Good") return "cr-settings-signal--good";
  if (status === "Low") return "cr-settings-signal--low";
  return "cr-settings-signal--high";
}
