import { Status, type BoardSize, type GameState, type SelectedCell } from "@/types/GameTypes"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware";

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
}

export const useGameStore = create<GameStore>()(
	persist(
		(set) => ({
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