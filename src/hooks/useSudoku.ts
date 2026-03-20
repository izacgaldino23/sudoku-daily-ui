import { useGame } from "./sudoku/useGame";
import { useSubmitSudokuSolve } from "./sudoku/mutations";

export function useSudoku() {
	const game = useGame();
	const submitMutation = useSubmitSudokuSolve();

	return {
		...game,
		submitMutation,
	};
}
