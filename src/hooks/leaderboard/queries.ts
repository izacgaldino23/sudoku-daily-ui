import { useQuery } from "@tanstack/react-query";
import { fetchLeaderboard } from "@/services/leaderboardApi";
import type { LeaderboardRequest, LeaderboardResponse } from "@/types/api/leaderboard";
import { useErrorHandler } from "../useErrorHandler";

async function safeFetchLeaderboard(params: LeaderboardRequest, handleError: (error: Error) => void): Promise<LeaderboardResponse> {
	try {
		return await fetchLeaderboard(params);
	} catch (error) {
		handleError(error as Error);
		throw error;
	}
}

export function useGetLeaderboard(params: LeaderboardRequest) {
	const handleError = useErrorHandler();

	return useQuery<LeaderboardResponse>({
		queryKey: ["get", "leaderboard", params.type, params.size, params.page, params.limit],
		queryFn: () => safeFetchLeaderboard(params, handleError),
		staleTime: 1000 * 60 * 5,
		refetchOnWindowFocus: false,
		retry: false,
		throwOnError: true,
	});
}