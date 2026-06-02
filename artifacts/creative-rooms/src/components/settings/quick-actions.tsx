import { ChevronRight, Gauge, RotateCcw, Waves } from "lucide-react";
import { QUICK_ACTIONS } from "@/lib/settings-demo-data";

const ACTION_ICONS = {
  calibrate: Gauge,
  test: Waves,
  reset: RotateCcw,
} as const;

interface SettingsQuickActionsProps {
  onCalibrate?: () => void;
  onTest?: () => void;
  onReset?: () => void;
}

export function SettingsQuickActions({
  onCalibrate,
  onTest,
  onReset,
}: SettingsQuickActionsProps) {
  const handlers: Record<string, (() => void) | undefined> = {
    calibrate: onCalibrate,
    test: onTest,
    reset: onReset,
  };

  return (
    <section className="cr-settings-rail-card">
      <h3 className="cr-settings-rail-title">Quick actions</h3>
      <ul className="cr-settings-rail-list">
        {QUICK_ACTIONS.map((action) => {
          const Icon = ACTION_ICONS[action.id as keyof typeof ACTION_ICONS];
          return (
            <li key={action.id}>
              <button
                type="button"
                className="cr-settings-rail-item"
                onClick={handlers[action.id]}
              >
                <span className="cr-settings-rail-item-icon">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </span>
                <span className="cr-settings-rail-item-copy">
                  <span className="cr-settings-rail-item-title">{action.title}</span>
                  <span className="cr-settings-rail-item-desc">{action.description}</span>
                </span>
                <ChevronRight className="w-4 h-4 shrink-0 opacity-50" />
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
