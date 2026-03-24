import { useMutation } from "@tanstack/react-query";
import { fetchDailySudoku, submitSudokuSolve } from "@/services/sudokuApi";
import { MUTATION_CONFIG } from "../config";

export function useSubmitSudokuSolve() {
	return useMutation({
		mutationFn: submitSudokuSolve,
		...MUTATION_CONFIG,
		mutationKey: ["sudoku", "submit"],
	});
}

export function useDailySudoku() {
    const mutation = useMutation({
        mutationKey: ["sudoku", "daily"],
        mutationFn: fetchDailySudoku,
        ...MUTATION_CONFIG,
    });

    return mutation;
}