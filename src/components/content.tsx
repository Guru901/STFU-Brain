"use client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import AppNavbar from "@/components/app-navbar";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import QueryProvider from "./query-provider";

export default function Content({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <QueryProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <TooltipProvider>
            <AppNavbar />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="flex-1"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </TooltipProvider>
        </main>
      </SidebarProvider>
    </QueryProvider>
  );
}
