import type { BoardSize } from "@/types/game";
import { mapSudokuFromResponse } from "@/utils/mappers";
import { useEffect, useState } from "react";
import { useDailySudoku } from "./sudoku/queries";
import { Status } from "@/types/game";
import { useSubmitSudokuSolve } from "./sudoku/mutations";
import { useGameStore } from "@/store/useGameStore";

export function useSudoku() {
	const state = useGameStore(s => s.state);
	const loadingGame = useGameStore(s => s.loadingGame);
	
	const [size, setSize] = useState<BoardSize | null>(null);

	const dailyQuery = useDailySudoku(size);
	const submitMutation = useSubmitSudokuSolve();

	useEffect(() => {
		if (!dailyQuery.data || !size) return;

		const dataMapped = mapSudokuFromResponse(dailyQuery.data);

		useGameStore.getState().startGame(size, {
			board: dataMapped.values,
			fixed: dataMapped.fixed,
			session_token: dataMapped.session_token
		});
	}, [dailyQuery.data, size]);

	function loadGame(newSize: BoardSize) {
		if (state[newSize]?.status === Status.PLAYING) {
			return;
		}

		loadingGame(newSize);
		setSize(newSize);
	}

	function submit(currentSize: BoardSize) {
		if (!state[currentSize]) return;

		const gameState = state[currentSize];
		
		submitMutation.mutate({
			play_token: gameState.session_token,
			solution: gameState.board,
		}, {
			onSuccess: () => {
				useGameStore.getState().finishGame(currentSize);
			},
		});
	}

	return {
		loading: dailyQuery.isLoading,
		loadGame,
		submit,
		submitMutation,
		dailyQuery,
	}
}