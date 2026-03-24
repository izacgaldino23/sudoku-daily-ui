export const Types = { PLAYING: "playing", FINISHED: "finished", LOADING: "loading" };

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
	entries: Array<entries>;
};
