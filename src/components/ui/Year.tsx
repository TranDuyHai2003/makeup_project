"use client";
import { useEffect, useState } from "react";

/** Năm hiện tại, tính ở client để trang vẫn prerender tĩnh được. */
export function Year() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);
  return <>{year ?? ""}</>;
}
