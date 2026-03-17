import type { BoardSize } from "@/types/GameTypes";
import { mapSudokuFromResponse } from "@/utils/mappers";
import { useEffect, useRef, useState } from "react";
import { useDailySudoku } from "./sudoku/queries";
import { Status } from "@/types/GameTypes";
import { getErrorMessage } from "@/services/errors";
import { useSubmitSudokuSolve } from "./sudoku/mutations";
import { useGameStore } from "@/store/useGameStore";
import { useAlertStore } from "@/store/useAlertStore";

export function useSudoku() {
	const state = useGameStore(s => s.state);
	const loadingGame = useGameStore(s => s.loadingGame);
	const pushAlert = useAlertStore(s => s.pushAlert)
	
	const [size, setSize] = useState<BoardSize | null>(null);

	const dailyQuery = useDailySudoku(size);
	const submitMutation = useSubmitSudokuSolve();

	const errorShownRef = useRef(false);
	const submittedRef = useRef(false);

	useEffect(() => {
		errorShownRef.current = false;
		submittedRef.current = false;
	}, [size]);

	useEffect(() => {
		if (dailyQuery.isError && !errorShownRef.current) {
			errorShownRef.current = true;
			pushAlert(getErrorMessage(dailyQuery.error), "error");
		}
	}, [dailyQuery, pushAlert]);

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
		if (!state[currentSize] || submittedRef.current) return;

		submittedRef.current = true;
		const gameState = state[currentSize];
		const playToken = gameState.session_token;
		
		submitMutation.mutate({
			play_token: playToken,
			solution: gameState.board,
		}, {
			onError: (err) => {
				submittedRef.current = false;
				pushAlert(getErrorMessage(err), "error");
			},
			onSuccess: () => {
				console.log("success");
				useGameStore.getState().finishGame(currentSize);
			}
		});
	}

	return {
		loading: dailyQuery.isLoading,
		loadGame,
		submit,
	}
}