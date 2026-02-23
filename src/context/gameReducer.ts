import { Status, type GameAction, type GameState } from "@/types/GameTypes";

export function gameReducer(state: GameState, action: GameAction): GameState {
	switch (action.type) {
		case "LOADING_GAME":
			return { ...state, [action.size]: { status: Status.LOADING } };
		case "START_GAME":
			return {
				...state,
				[action.size]: {
					board: action.payload.board,
					fixed: action.payload.fixed,
					selectedCell: null,
					seconds: 0,
					status: Status.PLAYING,
				}
			}
		case "SELECT_CELL":
			return {
				...state,
				[action.size]: {
					...state[action.size],
					selectedCell: action.payload,
				}
			}
		case "SET_VALUE": {
			const { row, col, value } = action.payload;
			const currentState = state[action.size];

			// return if this size is not started or this cell is fixed
			if (!currentState || currentState.fixed[row][col]) return state

			const newBoardState = currentState.board.map((row: number[]) => [...row])
			newBoardState[row][col] = value

			return {
				...state,
				[action.size]: {
					...state[action.size],
					board: newBoardState
				}
			}
		}
		case "CLEAR_VALUE": {
			const { row, col } = action.payload;
			const currentState = state[action.size];

			if (!currentState || currentState.fixed[row][col]) return state;

			const newBoardState = currentState.board.map((row: number[]) => [...row]);
			newBoardState[row][col] = 0;

			return {
				...state,
				[action.size]: {
					...state[action.size],
					board: newBoardState
				}
			}
		}
		case "TICK": {
			const currentState = state[action.size];
			if (!currentState || currentState.status !== Status.PLAYING) return state
			
			return {
				...state,
				[action.size]: {
					...state[action.size],
					seconds: currentState.seconds + 1,
				}
			}
		}
			
		case "FINISH_GAME":
			return {
				...state,
				[action.size]: {
					...state[action.size],
					status: Status.FINISHED,
				}
			}
		default:
			return state
	}
}