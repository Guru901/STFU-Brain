"use client";

import { usePathname } from "next/navigation";
import { SearchIcon, UserIcon } from "./ui/icons";

export default function AppNavbar() {
  const pathname = usePathname();

  return pathname === "/" || "/focus" ? (
    <></>
  ) : (
    <div className="bg-[#F9F9F7CC] px-12 h-16 flex items-center justify-between">
      <div className="flex gap-8 items-center">
        <h1 className="font-semibold text-md">BRAIN DUMP</h1>
        <p className="font-medium text-[10px] text-[#767C79]">SAVED TO CLOUD</p>
      </div>
      <div className="flex gap-6 items-center">
        <SearchIcon />
        <UserIcon />
      </div>
    </div>
  );
}
