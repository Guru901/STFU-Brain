"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DashboardIcon,
  DeclutterIcon,
  DumpIcon,
  InsightsIcon,
} from "./ui/icons";

export default function AppSidebar() {
  const pathname = usePathname();
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <Sidebar
      className="flex h-screen flex-col gap-12 px-6 py-8 bg-[#F2F4F2]"
      collapsible="none"
    >
      <SidebarHeader className="pb-8 px-2">
        <h1 className="text-2xl font-light text-[#4E635A]">
          <i>STFU Brain</i>
        </h1>
        <p className="text-sm font-light text-[#4E635A]">SHUT THE FUCK UP</p>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-12">
        <SidebarGroup>
          <div className="flex flex-col gap-6">
            <Link
              href={"/dashboard"}
              className={`flex items-center gap-4 text-md px-5
                ${active == "/dashboard" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold" : "text-[#767C79] font-medium"}
                `}
            >
              <DashboardIcon
                fill={active == "/dashboard" ? "#4e635a" : "#767676"}
              />
              Dashboard
            </Link>
            <Link
              href={"/dump"}
              className={`flex items-center gap-4 text-md px-5
                ${active == "/dump" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold" : "text-[#767C79] font-medium"}
                `}
            >
              <DumpIcon fill={active == "/dump" ? "#4e635a" : "#767676"} />
              Brain Dump
            </Link>
            <Link
              href={"/declutter"}
              className={`flex items-center gap-4 text-md px-5
                ${active == "/declutter" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold" : "text-[#767C79] font-medium"}
                `}
            >
              <DeclutterIcon
                fill={active == "/declutter" ? "#4e635a" : "#767676"}
              />
              Declutter
            </Link>
            <Link
              href={"/insights"}
              className={`flex items-center gap-4 text-md px-5
                ${active == "/insights" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold" : "text-[#767C79] font-medium"}
                `}
            >
              <InsightsIcon
                fill={active == "/insights" ? "#4e635a" : "#767676"}
              />
              Insights
            </Link>
          </div>
        </SidebarGroup>
        <Button className="text-md py-6">
          <HugeiconsIcon
            icon={PlusSignIcon}
            size={12}
            color="currentColor"
            strokeWidth={1.5}
          />
          New Entry
        </Button>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
