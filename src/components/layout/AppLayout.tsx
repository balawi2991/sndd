import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

const AppLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AppSidebar />
        <SidebarInset className="flex-1 w-full min-w-0">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;