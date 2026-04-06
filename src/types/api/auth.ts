import type { BoardSize } from "../game";

export type AuthData = {
	accessToken: string;
	refreshToken: string;
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
	refresh_token: string;
	username: string;
	email: string;
}

export type RefreshResponse = {
	accessToken: string;
}

export type ProfileResume = {
	TotalGames: Record<BoardSize, number>
	TodayGames: Record<BoardSize, GameResult>
	BestTimes: Record<BoardSize, GameResult>
}

export type GameResult = {
	Size: BoardSize
	Finished: boolean
	Time: number
}