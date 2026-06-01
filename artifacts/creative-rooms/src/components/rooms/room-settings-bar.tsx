import { Settings, LogOut, Sliders } from "lucide-react";

export function RoomSettingsBar() {
  return (
    <div className="cr-room-settings-bar">
      <button type="button" className="cr-settings-item">
        <Settings className="w-3.5 h-3.5" />
        Room settings
      </button>

      <label className="cr-settings-item cr-settings-knob">
        <Sliders className="w-3.5 h-3.5 shrink-0" />
        <span>Monitor mix</span>
        <input type="range" min={0} max={100} defaultValue={62} className="cr-settings-range" />
      </label>

      <label className="cr-settings-item cr-settings-knob">
        <span>Reverb send</span>
        <input type="range" min={0} max={100} defaultValue={25} className="cr-settings-range" />
        <span className="text-[10px] text-muted-foreground tabular-nums w-8">25%</span>
      </label>

      <label className="cr-settings-item">
        <span>Noise gate</span>
        <select className="cr-settings-select" defaultValue="off">
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>
      </label>

      <label className="cr-settings-item">
        <span>Limiter</span>
        <select className="cr-settings-select" defaultValue="on">
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>
      </label>

      <label className="cr-settings-item">
        <span>Quality</span>
        <select className="cr-settings-select" defaultValue="high">
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>

      <button type="button" className="cr-settings-leave">
        <LogOut className="w-3.5 h-3.5" />
        Leave room
      </button>
    </div>
  );
}
