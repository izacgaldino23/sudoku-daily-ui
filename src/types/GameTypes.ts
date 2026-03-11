export const Status = { PLAYING: "playing", FINISHED: "finished", LOADING: "loading" };

export type GamesStatus = typeof Status[keyof typeof Status];

export interface SelectedCell {
	row: number;
	col: number;
}

export type BoardSize = 4 | 6 | 9;

export type GameState = Partial<Record<BoardSize, GameData>>;

export type GameData = {
	board: number[][];
	fixed: boolean[][];
	selectedCell: SelectedCell | null;
	seconds: number;
	status: GamesStatus;
	session_token: string
}

export interface GameContextType {
	state: GameState
	dispatch: React.Dispatch<GameAction>
}

export function BoardSizeToString(size: BoardSize) {
	switch (size) {
		case 4:
			return "four"
		case 6:
			return "six"
		case 9:
			return "nine"
		default:
			return "four"
	}
}

export type GameAction = 
	| { type: "LOADING_GAME"; size: BoardSize; }
	| { type: "START_GAME"; size: BoardSize; payload: { board: number[][], fixed: boolean[][], session_token: string } }
	| { type: "SELECT_CELL"; size: BoardSize; payload: SelectedCell }
	| { type: "SET_VALUE"; size: BoardSize; payload: { row: number, col: number, value: number } }
	| { type: "CLEAR_VALUE"; size: BoardSize; payload: { row: number, col: number } }
	| { type: "TICK"; size: BoardSize;}
	| { type: "FINISH_GAME"; size: BoardSize; }