import type { BoardSize } from "../game";

export type { BoardSize };

export type AuthData = {
	accessToken: string;
	username: string;
	email: string;
}

export type RegisterRequest = {
	username: string;
	email: string;
	password: string;
}

export type LoginRequest = {
	email: string;
	password: string;
}

export type LoginResponse = {
	access_token: string;
	username: string;
	email: string;
}

export type RefreshResponse = {
	access_token: string;
}

export type ProfileResume = {
	total_games: Record<BoardSize, number>
	today_games: GameResult[]
	best_times: GameResult[]
}

export type GameResult = {
	size: BoardSize
	finished: boolean
	time: number
}