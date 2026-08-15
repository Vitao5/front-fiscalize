import AppSidebar from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { SidebarProvider } from "@/context/SidebarContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <AppSidebar />
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <AppHeader />
          <main className="flex-1 p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}