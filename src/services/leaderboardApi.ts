import type { LeaderboardRequest, LeaderboardResponse } from "@/types/api/leaderboard";
import { apiFetch } from "./api/client";

export async function fetchLeaderboard(params: LeaderboardRequest): Promise<LeaderboardResponse> {
	return apiFetch<LeaderboardResponse>({
		url: `/leaderboard`,
		params,
	}, []);
}