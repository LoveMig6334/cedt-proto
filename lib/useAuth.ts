"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearSession,
  getAccounts,
  getFactory,
  getSession,
  type Employee,
  type Factory,
} from "./auth";

export function useAuth() {
  const [user, setUser] = useState<Employee | null>(null);
  const [factory, setFactory] = useState<Factory | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      const accounts = getAccounts();
      const currentUser =
        accounts.find((a) => a.id === session.userId) ?? null;
      setUser(currentUser);
      setFactory(getFactory());
    }
    setLoading(false);
  }, []);

  function logout() {
    clearSession();
    router.push("/login");
  }

  return { user, factory, loading, logout };
}
