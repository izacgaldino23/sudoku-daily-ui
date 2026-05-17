export const Types = { DAILY: "daily", ALLTIME: "all-time", STREAK: "streak", TOTAL: "total" };

export const UnitTypes = { TIME: "time", COUNT: "count" };

export type LeaderboardTypes = typeof Types[keyof typeof Types];

export type LeaderboardUnitTypes = typeof UnitTypes[keyof typeof UnitTypes];

export type LeaderboardRequest = {
	limit: number;
	page: number;
	size?: string;
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
