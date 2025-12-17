import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black text-foreground">
        <AppSidebar />
        <main className="flex-1 overflow-auto">
             <div className="flex items-center px-4 py-2 md:hidden">
                <SidebarTrigger />
             </div>
            {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
