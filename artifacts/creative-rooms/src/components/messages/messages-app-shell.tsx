import { SidebarNav } from "@/components/layout/sidebar-nav";

interface MessagesAppShellProps {
  list: React.ReactNode;
  chat: React.ReactNode;
  details: React.ReactNode;
}

/** Nav | conversation list (~320) | chat (flex) | details (~320) */
export function MessagesAppShell({ list, chat, details }: MessagesAppShellProps) {
  return (
    <div className="cr-messages-app">
      <aside className="cr-messages-app-nav hidden md:flex">
        <SidebarNav />
      </aside>
      <div className="cr-messages-app-body">
        {list}
        {chat}
        <div className="cr-messages-details-wrap hidden lg:block">{details}</div>
      </div>
    </div>
  );
}
