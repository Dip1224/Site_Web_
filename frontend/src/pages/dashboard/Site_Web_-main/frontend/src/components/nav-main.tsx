"use client"

import { IconMail, type Icon } from "@tabler/icons-react"

import { Button } from '@/components/ui/button'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
// QuickCreate temporarily disabled to avoid heavy modal import
import { Link, useLocation } from 'react-router-dom'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const location = useLocation()

  const isItemActive = (url: string) => {
    try {
      // Normalize by reading section from the provided url
      const [path, query] = url.split("?")
      const urlSection = new URLSearchParams(query || "").get("section") || ""

      const currentPath = location.pathname
      const currentSection = new URLSearchParams(location.search || "").get("section") || ""

      // If the item points to a path without section (pure /dashboard)
      // consider it active when current path matches and no section is selected.
      if (!urlSection) {
        return currentPath === path && !currentSection
      }

      // Otherwise match both path and section
      return currentPath === path && currentSection === urlSection
    } catch {
      return false
    }
  }
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Button size="sm" className="h-8 px-3" variant="outline">
              +
              <span className="ml-2">Creación rápida</span>
            </Button>
            <Button size="icon" className="size-8 group-data-[collapsible=icon]:opacity-0" variant="outline">
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const active = isItemActive(item.url)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={active}
                  className={active ? "bg-primary text-primary-foreground hover:bg-primary/90" : undefined}
                >
                  <Link to={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
