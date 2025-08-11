import { useState } from "react";
import {
  Home,
  Users,
  FolderOpen,
  FileText,
  Radio,
  Settings as SettingsIcon,
  Phone,
  Plus,
  Cog,
  Zap,
  Bot,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CreateCallForm } from "./CreateCallForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Schedule Call", url: "/schedule-call", icon: Phone },
  { title: "Experts", url: "/experts", icon: Users },
  // { title: "Campaigns", url: "/campaigns", icon: FolderOpen },
  { title: "Transcripts", url: "/transcripts", icon: FileText },
  { title: "Assistants", url: "/assistants", icon: Bot },
  // { title: "Interview Config", url: "/interview-config", icon: Cog },
  { title: "Settings", url: "/settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [showCreateForm, setShowCreateForm] = useState(false);

  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path;
  const collapsed = state === "collapsed";

  const getNavClassName = (path: string) =>
    isActive(path)
      ? "bg-gradient-to-r from-gradient-start to-gradient-end text-primary-foreground font-medium"
      : "hover:bg-accent hover:text-accent-foreground";

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent className={collapsed ? "p-2 space-y-3" : "p-4 space-y-6"}>
        {/* Logo/Brand */}
        <div
          className={`flex items-center ${
            collapsed ? "justify-center px-0" : "space-x-3 px-2"
          }`}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg flex items-center justify-center">
            <Phone className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <h2 className="text-lg font-semibold text-foreground">
              Interview Pro
            </h2>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={getNavClassName(item.url)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Create Button for Collapsed State */}
        {collapsed && (
          <div className="flex justify-center px-1">
            <Button
              size="sm"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-8 h-8 p-0"
              variant="outline"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
