import { useMemo, useState } from "react"
import "./Board.scss"
import Button from "./button/Button"
import { Eraser } from "lucide-react"

const boards: { [key: number]: { [key: string]: number } } = {
	4: randomGenerate(4),
	6: randomGenerate(6),
	9: randomGenerate(9),
}

interface BoardAttributes {
	size: number
}

interface TileAttributes {
	value?: number
	filled?: boolean
	x?: number
	y?: number
	onClick?: () => void
	selected?: boolean
}

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

function Tile({ value, x, y, filled, onClick, selected }: TileAttributes) {
	const classes = ['tile'];
	if (selected) classes.push('selected');
	if (filled) classes.push('filled');

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

export default function Board({ size }: BoardAttributes) {
	const { values, fixed } = useMemo(() => generateTiles(size), [size])

	const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
	const [ boardState, setBoardState ] = useState<number[][]>(values);
	const [ fixedCells ] = useState<boolean[][]>(fixed);

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

			<div className="buttons">
				{buttonsLabels.map((label) => (
					<Button key={label} text={label} onClick={handleNumberButtonClick}/>
				))}
				<Button className="eraser" onClick={handleNumberButtonClick} text="">
					<Eraser />
				</Button>
			</div>
		</div>
	)
}