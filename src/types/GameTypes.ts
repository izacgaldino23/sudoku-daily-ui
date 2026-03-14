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

export class Binary {
	val: number;

	constructor(val: number) {
		this.val = 1 <<val;
	}

	add(other: number) {
		this.val = this.val | (1 << other);
	}

	contains(other: number) {
		return (this.val & (1 << other)) !== 0;
	}
}