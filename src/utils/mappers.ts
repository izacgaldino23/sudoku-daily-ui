import type { DailySudokuResponse } from "@/services/apiMock"

interface Board {
	values: number[][]
	fixed: boolean[][]
}

export function mapFromResponse(data: DailySudokuResponse): Board {
	const values: number[][] = [];
	const fixed: boolean[][] = [];

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

	return { values, fixed }
}