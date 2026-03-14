import { useMutation } from "@tanstack/react-query";
import { submitSudokuSolve } from "@/services/api";
import type { SubmitSudokuSolve } from "@/types/ApiTypes";

export function useSubmitSudokuSolve() {
	const mutation =  useMutation({
		mutationFn: (data: SubmitSudokuSolve) => submitSudokuSolve(data),
		retry: 3,
		retryDelay: 1000,
	})

	return { ...mutation}
}