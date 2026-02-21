export type GamesStatus = "playing" | "finished";

export interface SelectedCell {
	row: number;
	col: number;
}

export interface GameState {
	size: number;
	board: number[][];
	fixed: boolean[][];
	selectedCell: SelectedCell | null;
	seconds: number;
	status: GamesStatus;
}

export interface GameContextType {
	state: GameState
	dispatch: React.Dispatch<GameAction>
}

export type GameAction = 
	| { type: "START_GAME"; payload: { size: number, board: number[][], fixed: boolean[][] } }
	| { type: "SELECT_CELL"; payload: SelectedCell }
	| { type: "SET_VALUE"; payload: { row: number, col: number, value: number } }
	| { type: "CLEAR_VALUE"; payload: { row: number, col: number } }
	| { type: "TICK"}
	| { type: "FINISH_GAME" }