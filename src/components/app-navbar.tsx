"use client";

import { usePathname } from "next/navigation";
import { SearchIcon, UserIcon } from "./ui/icons";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { deleteCookie } from "cookies-next";

export default function AppNavbar() {
  const pathname = usePathname();
  const [isDump, setIsDump] = useState(false);

  useEffect(() => {
    setIsDump(pathname === "/dump");
  }, [pathname]);

  return pathname === "/" ||
    pathname === "/focus" ||
    pathname == "/onboarding" ||
    pathname === "/add-task" ? (
    <></>
  ) : !isDump ? (
    <div className="bg-[#F9F9F7CC] px-12 h-16 flex items-center justify-between">
      <div className="flex gap-8 items-center">
        <h1 className="text-md">MONDAY, OCT 24</h1>
      </div>
      <div className="flex gap-6 items-center">
        <Button
          variant={"destructive"}
          className={"py-2 px-4"}
          onClick={() => {
            deleteCookie("user");
            deleteCookie("codes");
          }}
        >
          Clear Cookies
        </Button>
        <Search />
        <UserIcon />
      </div>
    </div>
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

function Search() {
  return (
    <div className="w-full">
      <div className="relative">
        <Input
          className="bg-[#F2F4F2] py-2 rounded-full w-[256px] h-8"
          placeholder="Search..."
          type="text"
        />
        <SearchIcon className="absolute top-1/2 right-3 -translate-y-1/2" />
      </div>
    </div>
  );
}
