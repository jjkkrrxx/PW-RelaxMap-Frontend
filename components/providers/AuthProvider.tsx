"use client";

import { useEffect, useRef } from "react";
import axios from "axios";
import { fetchCurrentUser, refreshSession } from "@/components/utils/auth";
import { useAuthStore } from "@/lib/store/authStore";

const isUnauthorized = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401;

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setHydrated = useAuthStore((s) => s.setHydrated);

  // у dev-режимі React запускає ефект двічі — перевіряємо сесію лише раз
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const hydrate = async () => {
      try {
        setUser(await fetchCurrentUser());
      } catch (error) {
        // access прострочений → пробуємо refresh і питаємо ще раз
        if (isUnauthorized(error)) {
          try {
            await refreshSession();
            setUser(await fetchCurrentUser());
            return;
          } catch {
            // refresh теж не вдався — сесії немає
          }
        }
        clearAuth();
      } finally {
        setHydrated();
      }
    };

    hydrate();
  }, [setUser, clearAuth, setHydrated]);

  return <>{children}</>;
}
