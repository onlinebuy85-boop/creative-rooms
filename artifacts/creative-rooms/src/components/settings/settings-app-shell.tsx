import { SidebarNav } from "@/components/layout/sidebar-nav";

interface SettingsAppShellProps {
  main: React.ReactNode;
  rail: React.ReactNode;
}

/** Nav | settings main (flex) | health rail (~340px) */
export function SettingsAppShell({ main, rail }: SettingsAppShellProps) {
  return (
    <div className="cr-settings-app">
      <aside className="cr-settings-app-nav hidden md:flex">
        <SidebarNav />
      </aside>
      <div className="cr-settings-app-body">
        {main}
        <div className="cr-settings-rail-wrap hidden lg:block">{rail}</div>
      </div>
    </div>
  );
}
