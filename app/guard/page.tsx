"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GuardRedirect() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard/guard"); }, [router]);
  return null;
}
