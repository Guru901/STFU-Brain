"use client";

import { getCookie } from "cookies-next";

export function useUser() {
  const user = getCookie("user");
  const codes = getCookie("codes");

  console.log(user, codes);

  if (user && codes) {
    return { user, codes };
  }

  return { user: null, codes: null };
}
