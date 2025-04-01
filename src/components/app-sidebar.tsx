"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  } from "@/components/ui/sidebar"

import { useRouter } from "next/navigation"

interface SidebarItem {
  title: string
  url: string
}

// Menu items.
const items: SidebarItem[] = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Stock",
    url: "/stocks",
  },
  {
    title: "Add Stock",
    url: "/stocks/addStock",
  },
  {
    title: "Search",
    url: "#",
  },
  {
    title: "Settings",
    url: "#",
  },
  ]

export function AppSidebar() {
  const router = useRouter()

  function moveRoute(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  e.preventDefault()
  router.push(href)
  }

  return (
  <Sidebar className="w-64 h-screen bg-gray-800 text-black">
    <SidebarContent className="p-4">
    <SidebarMenu>
      {items.map((item) => (
      <SidebarMenuItem key={item.title} className="mb-2">
        <SidebarMenuButton asChild>
        <a
          href={item.url}
          onClick={(e) => moveRoute(e, item.url)}
          className="block px-4 py-2 rounded  hover:bg-gray-700 transition"
        >
          {item.title}
        </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
      ))}
    </SidebarMenu>
    </SidebarContent>
  </Sidebar>
  )
}