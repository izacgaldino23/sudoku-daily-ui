export type Cell = {
	row: number;
	col: number;
	value: number;
}

export type Board = Cell[]

export type DailySudokuResponse = {
	id: string
	size: number
	board: Board
	date: string
	session_token: string
}

export type SubmitSudokuSolve = {
	play_token: string
	solution: number[][]
}

export type MyDailySolvesResponse = SolvesResponse[]

export type SolvesResponse = {
	date: string;
	duration: number;
	id: string;
	size: number;
	started_at: string;
}