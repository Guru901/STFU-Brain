"use client";

import { usePathname } from "next/navigation";
import { SearchIcon, UserIcon } from "./ui/icons";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function AppNavbar() {
  const pathname = usePathname();

  const today = new Date();

  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const isDump = pathname === "/dump";

  return pathname === "/" ||
    pathname === "/focus" ||
    pathname == "/onboarding" ||
    pathname === "/add-task" ? (
    <></>
  ) : !isDump ? (
    <div className="bg-[#F9F9F7CC] px-12 h-16 flex items-center justify-between">
      <div className="flex gap-8 items-center">
        <h1 className="text-md">{formattedDate}</h1>
      </div>
      <div className="flex gap-6 items-center">
        <Search />
        <Link href={"/me"}>
          <UserIcon />
        </Link>
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
        <Link href={"/me"}>
          <UserIcon />
        </Link>
      </div>
    </div>
  );
}

function Search() {
  const { register, handleSubmit, reset } = useForm<{ query: string }>({
    defaultValues: { query: "" },
  });

  const onSubmit = () => {
    reset();
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <Input
          className="bg-[#F2F4F2] py-2 rounded-full w-[256px] h-8"
          placeholder="Search..."
          type="text"
          {...register("query")}
        />
        <SearchIcon className="absolute top-1/2 right-3 -translate-y-1/2" />
      </div>
    </form>
  );
}
