import type { DailySudokuResponse } from "@/services/api"

interface Board {
	values: number[][]
	fixed: boolean[][]
	session_token: string
}

export function mapFromResponse(data: DailySudokuResponse): Board {
	const values: number[][] = [];
	const fixed: boolean[][] = [];
	const session_token = data.session_token

	for (let i = 0; i < data.size; i++) {
		values[i] = []
		fixed[i] = []
		for (let j = 0; j < data.size; j++) {
			values[i][j] = 0;
			fixed[i][j] = false
		}
	}

	for (const cell of data.board) {
		values[cell.row][cell.col] = cell.value;
		fixed[cell.row][cell.col] = true
	}

	return { values, fixed, session_token }
}