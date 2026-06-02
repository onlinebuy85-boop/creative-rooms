import { SidebarNav } from "@/components/layout/sidebar-nav";

interface ProfileAppShellProps {
  main: React.ReactNode;
  rail: React.ReactNode;
}

/** Nav | profile main | right rail (~320px) */
export function ProfileAppShell({ main, rail }: ProfileAppShellProps) {
  return (
    <div className="cr-profile-app">
      <aside className="cr-profile-app-nav hidden md:flex">
        <SidebarNav />
      </aside>
      <div className="cr-profile-app-body">
        {main}
        <div className="cr-profile-rail-wrap hidden xl:block">{rail}</div>
      </div>
    </div>
  );
}
