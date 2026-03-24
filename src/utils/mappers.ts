import type { LoginResponse } from "@/types/api/auth";
import type { DailySudokuResponse } from "@/types/api/sudoku";

interface Board {
	values: number[][]
	fixed: boolean[][]
	session_token: string
}

interface AuthUser {
	username: string
	email: string
	accessToken: string
	refreshToken: string
}

export function mapSudokuFromResponse(data: DailySudokuResponse): Board {
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

export function mapAuthLoginFromResponse(data: LoginResponse): AuthUser {
	return {
		username: data.username,
		email: data.email,
		accessToken: data.accessToken,
		refreshToken: data.refreshToken
	}
}