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
	startTime: number;
	endTime: number;
	status: GamesStatus;
	session_token: string
}
