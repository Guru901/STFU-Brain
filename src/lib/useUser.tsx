"use client";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export function useUser() {
  const user = getCookie("user");
  const codes = getCookie("codes");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (user && codes) {
      const stored = localStorage.getItem("avatar");
      if (stored) setAvatar(stored);
    }
  }, []);

  // Expose setter so pages can update state + localStorage together
  const updateAvatar = (b64: string) => {
    localStorage.setItem("avatar", b64);
    setAvatar(b64);
  };

  if (user && codes) {
    return { user, codes, avatar: avatar || null, updateAvatar };
  }
  return { user: null, codes: null, avatar: null, updateAvatar };
}
