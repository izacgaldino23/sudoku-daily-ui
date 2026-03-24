import { useQuery } from "@tanstack/react-query";
import { QUERY_CONFIG } from "../config";
import { fetchLeaderboard } from "@/services/leaderboardApi";
import type { LeaderboardRequest } from "@/types/api/leaderboard";

export function useGetLeaderboard(params: LeaderboardRequest) {
    return useQuery({
        queryKey: ["get", "leaderboard", params.type],
        queryFn: () => fetchLeaderboard(params),
        enabled: params !== null,
        ...QUERY_CONFIG,
    });
}