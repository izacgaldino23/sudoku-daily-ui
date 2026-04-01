export const Types = { DAILY: "daily", ALLTIME: "alltime", STREAK: "streak", TOTAL: "total" };

export type LeaderboardTypes = typeof Types[keyof typeof Types];

export type LeaderboardRequest = {
	limit: number;
	page: number;
	size: string;
	type: LeaderboardTypes;
};

export type entries = {
	rank: number;
	username: string;
	value: string;
}

export type LeaderboardResponse = {
	has_next: boolean;
	solves: Array<entries>;
};
