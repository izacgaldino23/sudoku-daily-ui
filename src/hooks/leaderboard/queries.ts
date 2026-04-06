import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "@/services/leaderboardApi";
import type { LeaderboardRequest, LeaderboardResponse } from "@/types/api/leaderboard";

export function useGetLeaderboard(params: LeaderboardRequest) {
	return useQuery<LeaderboardResponse>({
		queryKey: ["get", "leaderboard", params.type, params.size, params.page, params.limit],
		queryFn: () => fetchLeaderboard(params),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		retry: false,
	});
}