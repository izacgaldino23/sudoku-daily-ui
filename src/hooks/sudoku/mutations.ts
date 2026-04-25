import { useMutation } from "@tanstack/react-query";
import { fetchDailySudoku, getDailySolves, submitSudokuSolve } from "@/services/sudokuApi";
import { useErrorHandler } from "../useErrorHandler";
import { useAuthErrorHandler } from "../useAuthErrorHandler";
import { isApiError } from "@/types/errors";

export function useSubmitSudokuSolve() {
	const handleError = useErrorHandler();

	return useMutation({
		mutationFn: submitSudokuSolve,
		retry: (failureCount, error) => {
			if (isApiError(error) && error.code === "invalid_solution") {
				return false;
			}
			return failureCount < 3;
		},
		retryDelay: 1000,
		mutationKey: ["sudoku", "submit"],
		onError: handleError,
	});
}

export function useDailySudoku() {
	const handleError = useErrorHandler();

	const mutation = useMutation({
		mutationKey: ["sudoku", "daily"],
		mutationFn: fetchDailySudoku,
		retry: 3,
		retryDelay: 1000,
		onError: handleError,
	});

	return mutation;
}

export function useGetDailySolves() {
	const handleError = useAuthErrorHandler();

	return useMutation({
		mutationFn: getDailySolves,
		retry: 3,
		retryDelay: 1000,
		mutationKey: ["sudoku", "me"],
		onError: handleError,
	});
}