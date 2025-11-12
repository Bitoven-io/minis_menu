import { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between p-4 border-b" data-testid="header-admin">
        <div className="flex items-center gap-4">
          <SidebarTrigger data-testid="button-sidebar-toggle" />
          <h1 className="text-xl font-semibold" data-testid="text-page-title">{title}</h1>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
