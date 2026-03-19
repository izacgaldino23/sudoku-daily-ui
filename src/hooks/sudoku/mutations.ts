import { useMutation } from "@tanstack/react-query";
import { submitSudokuSolve } from "@/services/sudokuApi";
import { MUTATION_CONFIG } from "../config";

export function useSubmitSudokuSolve() {
	return useMutation({
		mutationFn: submitSudokuSolve,
		...MUTATION_CONFIG,
		mutationKey: ["sudoku", "submit"],
	});
}