"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/lib/useUser";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

export default function Greetings() {
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const greeting = getGreeting();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-6xl font-light">
        {greeting}, {user || "User"}.
      </h1>
      <h2 className="text-[18px] w-132.5 text-[#767C79]">
        Your digital garden is waiting. Let&apos;s clear the mental fog and set
        a conscious intention for today.
      </h2>
    </div>
  );
}
