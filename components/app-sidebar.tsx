"use client"

import * as React from "react"
import {
  Code,
  FileText,
  Key,
  LayoutDashboard,
  Settings,
  LifeBuoy,
  LogOut
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { title: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
    { title: "API Keys", icon: Key, url: "/dashboard/api-keys" },
    { title: "Playground", icon: Code, url: "/dashboard/playground" },
    { title: "Documentación", icon: FileText, url: "/dashboard/docs" },
    { title: "Soporte", icon: LifeBuoy, url: "/dashboard/support" },
    { title: "Configuración", icon: Settings, url: "/dashboard/settings" },
  ]

  const handleLogout = async () => {
    try {
        await fetch('/api/logout', { method: 'POST' })
        router.push('/login')
    } catch (error) {
        console.error('Logout failed', error)
    }
  }

  return (
    <Sidebar className="border-r border-zinc-800 bg-black" {...props}>
      <SidebarHeader className="border-b border-zinc-800 bg-black px-4 py-4">
        <div className="flex items-center gap-2 font-semibold text-white">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[10px] text-black">
            R
          </div>
          <span>raean API</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-black">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    className="text-zinc-400 hover:bg-zinc-900 hover:text-white data-[active=true]:bg-zinc-900 data-[active=true]:text-white"
                  >
                    <a href={item.url}>
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.title}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="bg-black border-t border-zinc-800 p-4">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    onClick={handleLogout}
                    className="text-zinc-400 hover:bg-zinc-900 hover:text-red-400"
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar Sesión
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
