export type Cell = {
	row: number;
	col: number;
	value: number;
}

export type Board = Cell[]

export type DailySudokuResponse = {
	id: string
	date: string
	number: number
	size: number
	board: Board
}

const boards: { [key: number]: { [key: string]: number } } = {
	4: randomGenerate(4),
	6: randomGenerate(6),
	9: randomGenerate(9),
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

function generateTiles(size: number): Cell[] {
	const values: Cell[] = [];

	for (let row = 0; row < size; row++) {
		for (let col = 0; col < size; col++) {
			const index = `${col}.${row}`;

			if (index in boards[size]) {
				values.push({ row, col, value: boards[size][index] });
			} 
		}
	}

	return values;
}

export async function fetchSudokuBySize(size: number): Promise<DailySudokuResponse> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				id: "1",
				date: "2022-01-01",
				number: 1,
				size: size,
				board: generateTiles(size),
			})
		}, 100)
	})
}