import { useMutation } from "@tanstack/react-query";
import { fetchDailySudoku, getDailySolves, submitSudokuSolve } from "@/services/sudokuApi";
import { useErrorHandler } from "../useErrorHandler";
import { useAuthErrorHandler } from "../useAuthErrorHandler";

export function useSubmitSudokuSolve() {
	const handleError = useErrorHandler();

	return useMutation({
		mutationFn: submitSudokuSolve,
		retry: 3,
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