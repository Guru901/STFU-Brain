"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SearchIcon, UserIcon } from "./ui/icons";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Suspense } from "react";

export default function AppNavbarWrapper() {
  return (
    <Suspense fallback={<div className="h-16" />}>
      <AppNavbar />
    </Suspense>
  );
}

function AppNavbar() {
  const pathname = usePathname();
  const q = useSearchParams().get("q");

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
        <Search q={q} />
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

function Search({ q }: { q: string | null }) {
  const { register, handleSubmit } = useForm<{ query: string }>({
    defaultValues: { query: String(q || "") },
  });
  const router = useRouter();

  function onSubmit(data: { query: string }) {
    router.push(`/search?q=${data.query}`);
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="relative">
        <Input
          defaultValue={q || ""}
          className="bg-[#F2F4F2] py-2 w-[256px] h-8"
          placeholder="Search..."
          type="text"
          {...register("query")}
        />
        <SearchIcon
          className="absolute top-1/2 right-3 -translate-y-1/2"
          onClick={handleSubmit(onSubmit)}
        />
      </div>
    </form>
  );
}
