"use client";

import { getSession } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const session = getSession();

  useEffect(() => {
    if (!session) {
      router.replace("/login");
    }
  }, [router, session]);

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <div className="w-8 h-8 rounded-full border-[3px] border-p-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
