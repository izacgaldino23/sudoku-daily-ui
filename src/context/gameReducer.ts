import type { GameAction, GameState } from "@/types/GameTypes";

export function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "START_GAME":
			return {
				size: action.payload.size,
				board: action.payload.board,
				fixed: action.payload.fixed,
				selectedCell: null,
				seconds: 0,
				status: "playing",
			}
		case "SELECT_CELL":
			return {
				...state,
				selectedCell: action.payload,
			}
		case "SET_VALUE": {
			const { row, col, value } = action.payload

			if (state.fixed[row][col]) return state

			const newBoardState = state.board.map((row: number[]) => [...row])
			newBoardState[row][col] = value

			return {...state, board: newBoardState}
		}
		case "CLEAR_VALUE": {
			const { row, col } = action.payload;

			if (state.fixed[row][col]) return state;

			const newBoardState = state.board.map((row: number[]) => [...row]);
			newBoardState[row][col] = 0;

			return { ...state, board: newBoardState };
		}
		case "TICK":
			return {
				...state,
				seconds: state.seconds + 1,
			}
		case "FINISH_GAME":
			return {
				...state,
				status: "finished",
			}
		default:
			return state
	}
}