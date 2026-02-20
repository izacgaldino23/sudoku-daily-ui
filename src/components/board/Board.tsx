import { useMemo, useState } from "react"
import "./Board.scss"
import Button from "./button/Button"
import { Eraser } from "lucide-react"
import type { BoardAttributes, TileAttributes } from "@/types/BoardTypes"

function randomGenerate(size: number): { [key: string]: number } {
	const temp: { [key: string]: number } = {};

	const total = size * size;
	const percentage = 0.3;
	let count = Math.floor(total * percentage);

	while (count > 0) {
		const x = Math.floor(Math.random() * size) + 1;
		const y = Math.floor(Math.random() * size) + 1;
		const index = `${x}.${y}`;
		
		if (!(index in temp)) {
			temp[index] = Math.floor(Math.random() * size) + 1;
			count--;
		}
	}

	return temp
}

function Tile({ value, x, y, filled, onClick, selected, conflict }: TileAttributes) {
	const classes = ['tile'];
	if (selected) classes.push('selected');
	if (filled) classes.push('filled');
	if (conflict) classes.push('conflict');

	return (
		<div 
			className={classes.join(" ")}
			data-x={x}
			data-y={y} 
			onClick={onClick}>
			{value !== 0 ? value : ""}
		</div>
	)
}

function numberToName(num: number) {
	switch (num) {
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

const boards: { [key: number]: { [key: string]: number } } = {
	4: randomGenerate(4),
	6: randomGenerate(6),
	9: randomGenerate(9),
}

function generateTiles(size: number) {
	const values: number[][] = [];
	const fixed: boolean[][] = [];


	for (let row = 0; row < size; row++) {
		values[row] = [];
		fixed[row] = [];

		for (let col = 0; col < size; col++) {
			const index = `${col}.${row}`;

			if (index in boards[size]) {
				values[row][col] = boards[size][index];
				fixed[row][col] = true;
			} else {
				values[row][col] = 0;
				fixed[row][col] = false;
			}
		}
	}

	return {
		values,
		fixed
	}
}

function getConflicts(board: number[][]): Set<string> {
	const size = board.length;
	const conflicts = new Set<string>();

	// verify rows
	for (let row = 0; row < size; row++) {
		const seen = new Map<number, number[]>();

		for (let col = 0; col < size; col++) {
			const n = board[row][col];
			if (n === 0) continue;

			if (!seen.has(n)) {
				seen.set(n, [col]);
			} else {
				seen.get(n)?.push(col);
			}
		}

		seen.forEach((value) => {
			if (value.length === 1) return;
			value.forEach((col) => {
				conflicts.add(`${col}.${row}`);
			})
		})
	}

	// Verify cols
	for (let col = 0; col < size; col++) {
		const seen = new Map<number, number[]>();

		for (let row = 0; row < size; row++) {
			const n = board[row][col];
			if (n === 0) continue;

			if (!seen.has(n)) {
				seen.set(n, [row]);
			} else {
				seen.get(n)?.push(row);
			}
		}

		seen.forEach((value) => {
			if (value.length === 1) return;
			value.forEach((row) => {
				conflicts.add(`${col}.${row}`);
			})
		})
	}

	// Verify blocks
	const blockSizes: { [key: number]: number[] } = {
		4: [2, 2],
		6: [3, 2],
		9: [3, 3],
	};

	const bs = blockSizes[size];
	let currentRow = 0;
	let currentCol = 0;

	for (let block = 0; block < size; block++) {
		const seen = new Map<number, number[][]>();

		for (let row = currentRow; row < currentRow + bs[0]; row++) {
			for (let col = currentCol; col < currentCol + bs[1]; col++) {
				const n = board[row][col];
				if (n === 0) continue;

				if (!seen.has(n)) {
					seen.set(n, [[row, col]]);
				} else {
					seen.get(n)?.push([row, col]);
				}
			}
		}

		seen.forEach((value) => {
			if (value.length === 1) return;
			value.forEach((pos) => {
				conflicts.add(`${pos[1]}.${pos[0]}`);
			})
		})

		currentCol += bs[1];
		if (currentCol >= size) {
			currentCol = 0;
			currentRow += bs[0];
		}
	}

	return conflicts;
}

function isBoardComplete(board: number[][]) {
	return board.every((row) => row.every((n) => n !== 0));
}

export default function Board({ size }: BoardAttributes) {
	const { values, fixed } = useMemo(() => generateTiles(size), [size])

	const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
	const [ boardState, setBoardState ] = useState<number[][]>(values);
	const [ fixedCells ] = useState<boolean[][]>(fixed);

	const conflicts = useMemo(() => getConflicts(boardState), [boardState]);

	const isComplete = isBoardComplete(boardState);
	const hasConflicts = conflicts.size > 0;
	const isVictory = isComplete && !hasConflicts;

	const buttonsLabels = useMemo(() => {
		const labels: string[] = [];
		for (let i = 1; i <= size; i++) {
			labels.push(`${i}`);
		}
		return labels;
	}, [size]);

	const handleNumberButtonClick = function(value: string) {
		if (!selectedCell) return;

		const { row, col } = selectedCell;

		if (fixedCells[row][col]) return;

		const newBoardState = boardState.map((row: number[]) => [...row]);

		if (value === "")
			newBoardState[row][col] = 0;
		else
			newBoardState[row][col] = parseInt(value);

		setBoardState(newBoardState);
	}

	return (
		<div className="board">
			<div className={"grid "+numberToName(size)}>
				{boardState.map((row, rowIndex) => 
					row.map((value, colIndex) => (
						<Tile 
							value={value} 
							key={`${rowIndex}-${colIndex}`} 
							filled={fixedCells[rowIndex][colIndex]} 
							conflict={conflicts.has(`${colIndex}.${rowIndex}`)}
							selected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
							onClick={() => {
								if (!fixedCells[rowIndex][colIndex]) {
									setSelectedCell({ row: rowIndex, col: colIndex })
								}
							}}
							x={colIndex}
							y={rowIndex}
							/>
					))
				)}
			</div>

			{isVictory && <div className="victory">Você finalizou!</div>}

			{!isVictory && <div className="buttons">
				{buttonsLabels.map((label) => (
					<Button key={label} text={label} onClick={handleNumberButtonClick}/>
				))}
				<Button className="eraser" onClick={handleNumberButtonClick} text="">
					<Eraser />
				</Button>
			</div>}
		</div>
	)
}