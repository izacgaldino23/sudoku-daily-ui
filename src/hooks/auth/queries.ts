import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { refresh } from "@/services/authApi";
import { useAuthStore } from "@/store/useAuthStore";

const REFRESH_THRESHOLD_MS = 1.8e6; // 30 minutes

export function useProactiveRefresh() {
  const accessToken = useAuthStore((s) => s.state?.accessToken);
  const lastRefreshedAt = useAuthStore((s) => s.lastRefreshedAt);

  const shouldAttempt = useMemo(() => {
    if (!accessToken) return false;
    if (!lastRefreshedAt) return true;
    return Date.now() - lastRefreshedAt > REFRESH_THRESHOLD_MS;
  }, [accessToken, lastRefreshedAt]);

  return useQuery({
    queryKey: ["auth", "proactive-refresh"],
    queryFn: async () => {
      const res = await refresh();
      useAuthStore.getState().updateAccessToken(res.access_token);
      return res;
    },
    enabled: shouldAttempt,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
