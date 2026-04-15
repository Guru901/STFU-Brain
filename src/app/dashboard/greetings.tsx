"use client";

import { useUser } from "@/lib/useUser";

export default function Greetings() {
  const { user } = useUser();

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-6xl font-light">Good morning, {user || "User"}.</h1>
      <h2 className="text-[18px] w-132.5 text-[#767C79]">
        Your digital garden is waiting. Let's clear the mental fog and set a
        conscious intention for today.
      </h2>
    </div>
  );
}
