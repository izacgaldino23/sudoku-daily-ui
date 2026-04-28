import { useQuery } from "@tanstack/react-query";
import { refresh } from "@/services/authApi";
import { useAuthStore } from "@/store/useAuthStore";

const REFRESH_THRESHOLD_MS = 1.8e6; // 30 minutes

export function useProactiveRefresh () {
	const accessToken = useAuthStore((s) => s.state?.accessToken);

	return useQuery({
		queryKey: [ "auth", "proactive-refresh" ],
		queryFn: async () => {
			const state = useAuthStore.getState();
			const lastRefreshedAt = state.lastRefreshedAt;

			if (lastRefreshedAt && Date.now() - lastRefreshedAt <= REFRESH_THRESHOLD_MS) {
				return { skipped: true };
			}

			const res = await refresh();
			state.updateAccessToken(res.access_token);
			return { skipped: false, access_token: res.access_token };
		},
		enabled: !!accessToken,
		retry: false,
		staleTime: Infinity,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
	});
}
