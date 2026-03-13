import type { DailySudokuResponse, SubmitSudokuSolve } from "@/types/ApiTypes";
import { apiFetch, apiPost } from "./apiClient";

export async function fetchDailySudoku(size: string): Promise<DailySudokuResponse> {
    return apiFetch<DailySudokuResponse>({
		url: `/sudoku`,
		params: { size },
	});
}

export async function submitSudokuSolve(request: SubmitSudokuSolve): Promise<void> {
	return apiPost({
		url: `/sudoku/submit`,
		data: request,
	});
}