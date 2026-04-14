"use client";

import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export function useUser() {
  const user = getCookie("user");
  const codes = getCookie("codes");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (user && codes && !avatar.length) {
      const avatar = String(localStorage.getItem("avatar"));
      setAvatar(avatar);
    }
  }, [avatar]);

  if (user && codes) {
    return { user, codes, avatar };
  }

  return { user: null, codes: null, avatar: null };
}
