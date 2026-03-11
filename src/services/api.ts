import { apiFetch } from "./apiClient";

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

export async function fetchDailySudoku(size: string): Promise<DailySudokuResponse> {
    return apiFetch<DailySudokuResponse>({
		url: `/sudoku`,
		params: { size },
	});
}