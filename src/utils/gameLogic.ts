import { Binary } from "@/utils/binary";
import type { GameData } from "@/types/game";

const gridColsBySize: Record<number, number> = {
	4: 2,
	6: 3,
	9: 3
}

function getGridIndexByPosition(col: number, row: number, size: number, gridRows: number, gridCols: number) {
	const gridColCount = size / gridCols;

	const gridCol = Math.floor(col / gridCols);
	const gridRow = Math.floor(row / gridRows);

	return gridRow * gridColCount + gridCol;
}

export function getConflicts(board: number[][]): Set<string> {
	const size = board.length;
	const conflicts = new Set<string>();
	const rowCount: Binary[] = [];
	const colCount: Binary[] = [];
	const gridCount: Binary[] = [];

	// init
	for (let i = 0; i < size; i++) {
		rowCount.push(new Binary(0));
		colCount.push(new Binary(0));
		gridCount.push(new Binary(0));
	}

	const gridCols = gridColsBySize[size];
	const gridRows = size / gridCols;

	// verify asc order
	for (let row = 0; row < size; row++) {
		for (let col = 0; col < size; col++) {
			const n = board[row][col];
			if (n === 0) continue;
			const gridIndex = getGridIndexByPosition(col, row, size, gridRows, gridCols);

			const hasInRow = rowCount[row].contains(n);
			const hasInCol = colCount[col].contains(n);
			const hasInGrid = gridCount[gridIndex].contains(n);

			if (hasInRow || hasInCol || hasInGrid) conflicts.add(`${col}.${row}`);

			rowCount[row].add(n);
			colCount[col].add(n);
			gridCount[gridIndex].add(n);
		}
	}

	// clean up
	for (let i = 0; i < size; i++) {
		rowCount[i] = new Binary(0);
		colCount[i] = new Binary(0);
		gridCount[i] = new Binary(0);
	}

	// verify desc order
	for (let row = size - 1; row >= 0; row--) {
		for (let col = size - 1; col >= 0; col--) {

			const n = board[row][col];
			if (n === 0) continue;
			const gridIndex = getGridIndexByPosition(col, row, size, gridRows, gridCols);

			const hasInRow = rowCount[row].contains(n);
			const hasInCol = colCount[col].contains(n);
			const hasInGrid = gridCount[gridIndex].contains(n);

			if (hasInRow || hasInCol || hasInGrid) conflicts.add(`${col}.${row}`);

			rowCount[row].add(n);
			colCount[col].add(n);
			gridCount[gridIndex].add(n);
		}
	}

	return conflicts;
}

export function isBoardComplete(state: GameData | undefined) {
	if (!state) return false;
	const { board } = state;
	return board.every((row) => row.every((n) => n !== 0));
}

interface Clock {
	hours: string;
	minutes: number;
	remainingSeconds: number;
}

function zeroPad(num: number) {
	return String(num).padStart(2, '0');
}

export function SecondsToClock(seconds: number): Clock {
	const hours = zeroPad(Math.floor(seconds / 3600));
	const minutes = Math.floor((seconds % 3600) / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	return { hours, minutes, remainingSeconds };
}