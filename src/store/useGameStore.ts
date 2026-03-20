import { Status, type BoardSize, type GameState, type SelectedCell } from "@/types/game"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware";
import { fetchDailySudoku, submitSudokuSolve } from "@/services/sudokuApi";
import { mapSudokuFromResponse } from "@/utils/mappers";
import { BoardSizeToString } from "@/utils/board";
import { useAlertStore } from "./useAlertStore";
import { getErrorMessage } from "@/types/errors";

const TODAY = () => new Date().toDateString();

function isToday(timestamp: number): boolean {
	return new Date(timestamp).toDateString() === TODAY();
}

interface GameStore {
	state: GameState;
	
	// actions
	loadingGame: (size: BoardSize) => void
	startGame: (size: BoardSize, payload: { board: number[][], fixed: boolean[][], session_token: string }) => void
	selectCell: (size: BoardSize, payload: SelectedCell) => void
	setValue: (size: BoardSize, payload: { row: number, col: number, value: number }) => void
	clearValue: (size: BoardSize, payload: { row: number, col: number }) => void
	finishGame: (size: BoardSize) => void
	loadGame: (size: BoardSize) => Promise<void>
	submitSolve: (size: BoardSize) => Promise<void>
}

export const useGameStore = create<GameStore>()(
	persist(
		(set, get) => ({
			state: {},
			loadingGame: (size: BoardSize) => set(s => ({
				state: {
					...s.state,
					[size]: { status: Status.LOADING }
				}
			})),
			startGame: (size: BoardSize, payload: { board: number[][], fixed: boolean[][], session_token: string }) => set(s => ({
				state: {
					...s.state,
					[size]: {
						session_token: payload.session_token,
						board: payload.board,
						fixed: payload.fixed,
						selectedCell: null,
						startTime: Date.now(),
						status: Status.PLAYING,
					}
				}
			})),
			selectCell: (size: BoardSize, payload: SelectedCell) => set(s => ({
				state: {
					...s.state,
					[size]: {
						...s.state[size],
						selectedCell: payload
					}
				}
			})),
			setValue: (size: BoardSize, payload: { row: number, col: number, value: number }) => set(s => {
				const { row, col, value } = payload;
				const currentState = s.state[size];

				if (!currentState || currentState.fixed[row][col]) return s

				const newBoardState = currentState.board.map((row: number[]) => [...row])
				newBoardState[row][col] = value

				return ({
					state: {
						...s.state,
						[size]: {
							...currentState,
							board: newBoardState
						}
					}
				})
			}),
			clearValue: (size: BoardSize, payload: { row: number, col: number }) => set(s => {
				const { row, col } = payload;
				const currentState = s.state[size];

				if (!currentState || currentState.fixed[row][col]) return s

				const newBoardState = currentState.board.map((row: number[]) => [...row])
				newBoardState[row][col] = 0

				return ({
					state: {
						...s.state,
						[size]: {
							...currentState,
							board: newBoardState
						}
					}
				})
			}),
			finishGame: (size: BoardSize,) => set(s => ({
				state: {
					...s.state,
					[size]: {
						...s.state[size],
						status: Status.FINISHED,
						endTime: Date.now()
					}
				}
			})),
			loadGame: async (size: BoardSize) => {
				const { state } = get();
				if (state[size]?.status === Status.PLAYING) return;
				
				get().loadingGame(size);
				
				try {
					const data = await fetchDailySudoku(BoardSizeToString(size));
					const mapped = mapSudokuFromResponse(data);
					
					get().startGame(size, {
						board: mapped.values,
						fixed: mapped.fixed,
						session_token: mapped.session_token
					});
				} catch (err) {
					useAlertStore.getState().pushAlert(getErrorMessage(err as Error), "error");
				}
			},
			submitSolve: async (size: BoardSize) => {
				const { state } = get();
				const gameState = state[size];
				if (!gameState) return;
				
				try {
					await submitSudokuSolve({
						play_token: gameState.session_token,
						solution: gameState.board,
					});
					
					get().finishGame(size);
				} catch (err) {
					useAlertStore.getState().pushAlert(getErrorMessage(err as Error), "error");
				}
			},
		}),
		{ 
			name: "sudoku-game-state",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				if (!state) return;
				
				const hasValidState = Object.values(state.state).some(
					(gameData) => gameData?.startTime && isToday(gameData.startTime)
				);

				if (!hasValidState) {
					state.state = {};
				}
			}
		}
	)
)