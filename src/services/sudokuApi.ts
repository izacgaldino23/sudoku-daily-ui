import { sessionInterceptor } from "./api/interceptors/session";
import { authInterceptor } from "./api/interceptors/auth";
import { apiFetch, apiPost } from "./api/client";
import type { DailySudokuResponse, SubmitSudokuSolve } from "@/types/api/sudoku";

const interceptors = [sessionInterceptor, authInterceptor];

export async function fetchDailySudoku(size: string): Promise<DailySudokuResponse> {
	return apiFetch<DailySudokuResponse>({
		url: `/sudoku`,
		params: { size },
	}, interceptors);
}

export async function submitSudokuSolve(request: SubmitSudokuSolve): Promise<void> {
	return apiPost({
		url: `/sudoku/submit`,
		data: request,
	}, interceptors);
}
