"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BrainIcon,
  CreateIcon,
  DashboardIcon,
  DeclutterIcon,
  DumpIcon,
  FocusMode,
  TaskIcon,
} from "./ui/icons";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return pathname === "/" ||
    pathname == "/focus" ||
    pathname === "/add-task" ? (
    <></>
  ) : (
    <Sidebar
      className="sticky top-0 flex min-h-screen flex-col gap-12 px-6 py-8 bg-[#F2F4F2]"
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
          <div className="flex flex-col gap-3">
            <Link
              href={"/dashboard"}
              className={`flex items-center gap-4 text-md px-5 py-3
                ${active == "/dashboard" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold rounded-[2.5px]" : "text-[#767C79] font-medium"}
                `}
            >
              <DashboardIcon
                fill={active == "/dashboard" ? "#4e635a" : "#767676"}
              />
              Dashboard
            </Link>
            <Link
              href={"/dump"}
              className={`flex items-center gap-4 text-md px-5 py-3
                ${active == "/dump" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold rounded-[2.5px]" : "text-[#767C79] font-medium"}
                `}
            >
              <DumpIcon fill={active == "/dump" ? "#4e635a" : "#767676"} />
              Brain Dump
            </Link>
            <Link
              href={"/declutter"}
              className={`flex items-center gap-4 text-md px-5 py-3
                ${active == "/declutter" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold rounded-[2.5px]" : "text-[#767C79] font-medium"}
                `}
            >
              <DeclutterIcon
                fill={active == "/declutter" ? "#4e635a" : "#767676"}
              />
              Declutter
            </Link>
            <Link
              href={"/focus"}
              className={`flex items-center gap-4 text-md px-5 py-3
                ${active == "/insights" ? "border-l-2 border-l-muted-foreground text-[#4E635A] font-bold rounded-[2.5px]" : "text-[#767C79] font-medium"}
                `}
            >
              <FocusMode fill={active == "/insights" ? "#4e635a" : "#767676"} />
              Focus Mode
            </Link>
          </div>
        </SidebarGroup>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className={buttonVariants({ className: "py-3" })}>
            <HugeiconsIcon
              icon={PlusSignIcon}
              size={12}
              color="currentColor"
              strokeWidth={1.5}
            />
            <span className="text-md">New Entry</span>
          </DialogTrigger>
          <DialogContent className="max-w-3xl px-28 py-12 flex flex-col items-center w-max gap-3">
            <CreateIcon />
            <h1 className="text-4xl font-light pt-7">Create Sanctuary</h1>
            <p className="text-[#767C79] text-xl">
              Let it out, then let it go.
            </p>
            <div className="w-full flex pt-9 gap-6">
              <div
                className="bg-[#F2F4F2] p-8 rounded-xl flex flex-col gap-6"
                onClick={() => {
                  setOpen(false);
                  router.push("/dump");
                }}
              >
                <BrainIcon />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-[18px]">
                    Start Brain Dump
                  </h3>
                  <p className="text-[16px] text-[#5A605E]">
                    A stream of consciousness space for unfiltered thoughts.
                  </p>
                </div>
              </div>
              <div
                className="bg-[#F2F4F2] p-8 rounded-xl flex flex-col gap-6"
                onClick={() => {
                  setOpen(false);
                  router.push("/add-task");
                }}
              >
                <TaskIcon />
                <div className="flex flex-col">
                  <h3 className="font-semibold text-[18px]">Quick Task</h3>
                  <p className="text-[16px] text-[#5A605E]">
                    Capture a single, focused action to clear your mental tray.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
