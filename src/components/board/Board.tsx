import { useEffect, useMemo } from "react"
import "./Board.scss"
import Button from "../button/Button"
import { Eraser } from "lucide-react"
import type { BoardAttributes, TileAttributes } from "@/types/BoardTypes"
import { useGame } from "@/context/useGame"
import type { GameData } from "@/types/GameTypes"

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

function isBoardComplete(state: GameData | undefined) {
	if (!state) return false;
	const { board } = state;
	return board.every((row) => row.every((n) => n !== 0));
}

export default function Board({ size }: BoardAttributes) {
	const { state, dispatch } = useGame();
	const currentState = state[size];

	const conflicts = useMemo(() => {
		if (!currentState) return new Set<string>();
		return getConflicts(currentState.board);
	}, [currentState]);

	const isComplete = isBoardComplete(currentState);
	const hasConflicts = conflicts.size > 0;
	const isVictory = currentState && currentState.board.length > 0 && isComplete && !hasConflicts;

	useEffect(() => {
		if (isVictory) {
			dispatch({ type: "FINISH_GAME", size });
		}
	}, [isVictory, dispatch, size]);

	const buttonsLabels = useMemo(() => {
		const labels: string[] = [];
		for (let i = 1; i <= size; i++) {
			labels.push(`${i}`);
		}
		return labels;
	}, [size]);

	const handleSelectCell = (row: number, col: number) => {
		dispatch({
			type: "SELECT_CELL",
			payload: { row, col },
			size
		})
	}

	const handleSetValue = (value: string) => {
		if (!currentState || !currentState.selectedCell) return;

		let payload_value = value;
		if (value === "") payload_value = "0";

		dispatch({
			type: "SET_VALUE",
			size,
			payload: {
				row: currentState.selectedCell.row,
				col: currentState.selectedCell.col,
				value: parseInt(payload_value),
			}
		})
	}

	if (!currentState) return null;

	return (
		<div className="board">
			<div className={"grid "+numberToName(size)}>
				{currentState.board.map((row, rowIndex) => 
					row.map((value, colIndex) => (
						<Tile 
							value={value} 
							key={`${rowIndex}-${colIndex}`} 
							filled={currentState.fixed[rowIndex][colIndex]} 
							conflict={conflicts.has(`${colIndex}.${rowIndex}`)}
							selected={currentState.selectedCell?.row === rowIndex && currentState.selectedCell?.col === colIndex}
							onClick={() => handleSelectCell(rowIndex, colIndex)}
							x={colIndex}
							y={rowIndex}
							/>
					))
				)}
			</div>

			{isVictory && <div className="victory">Você finalizou!</div>}

			{!isVictory && <div className="buttons">
				{buttonsLabels.map((label) => (
					<Button className="square" key={label} text={label} onClick={handleSetValue}/>
				))}
				<Button className="eraser square" onClick={handleSetValue} text="">
					<Eraser />
				</Button>
			</div>}
		</div>
	)
}