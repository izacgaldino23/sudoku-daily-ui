export type Cell = {
	row: number;
	col: number;
	value: number;
}

export type Board = Cell[]

export type DailySudokuResponse = {
	id: string
	size: number
	board: Board
	date: string
	session_token: string
}

export type SubmitSudokuSolve = {
	play_token: string
	solution: number[][]
}

export const sessionHeader = "X-Session-Id";

export interface RequestConfig {
	url: string;
	method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
	headers?: Record<string, string>;
	body?: string;
	params?: Record<string, string>;
	requiresAuth?: boolean;
	data?: Record<string, unknown>;
}

export type ApiRequest = Omit<RequestConfig, "method">;
