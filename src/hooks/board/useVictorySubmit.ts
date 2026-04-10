import { useEffect, useRef } from "react"
import { useGameStore } from "@/store/useGameStore"
import { useSubmitSudokuSolve } from "@/hooks/sudoku/mutations"
import { getConflicts, isBoardComplete } from "@/utils/gameLogic"
import type { BoardSize } from "@/types/game"
import type { GameData } from "@/types/game"

interface UseVictorySubmitProps {
	size: BoardSize
	currentState: GameData | undefined
}

export function useVictorySubmit({ size, currentState }: UseVictorySubmitProps) {
	const finishGame = useGameStore(state => state.finishGame);
	const submitSolveMutation = useSubmitSudokuSolve();
	const hasSubmittedRef = useRef(false);

	const conflicts = currentState ? getConflicts(currentState.board) : new Set<string>();
	const hasConflicts = conflicts.size > 0;
	const isComplete = isBoardComplete(currentState);
	const isVictory = currentState && currentState.board.length > 0 && isComplete && !hasConflicts;
	const finished = currentState && currentState.status === "finished";

	useEffect(() => {
		if (!isVictory || finished || !currentState || hasSubmittedRef.current) return;

		hasSubmittedRef.current = true;
		submitSolveMutation.mutate({
			play_token: currentState.session_token,
			solution: currentState.board,
		}, {
			onSuccess: () => {
				finishGame(size);
			},
		});
	}, [submitSolveMutation, isVictory, finished, currentState, finishGame, size]);
}