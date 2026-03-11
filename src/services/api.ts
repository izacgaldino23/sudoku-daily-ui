import { apiFetch } from "./apiClient";

export type Cell = {
	row: number;
	col: number;
	value: number;
}

export type Board = Cell[]

export type DailySudokuResponse = {
	id: string
	date: string
	number: number
	size: number
	board: Board
}

export async function fetchDailySudoku(size: string): Promise<DailySudokuResponse> {
    return apiFetch<DailySudokuResponse>({
		url: `/sudoku`,
		params: { size },
	});
}