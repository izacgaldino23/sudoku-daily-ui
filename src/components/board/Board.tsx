import { useMemo } from "react"
import "./Board.scss"

interface BoardAttributes {
	size: number
}

interface TileAttributes {
	value?: number
	x?: number
	y?: number
}

function Tile({ value, x, y }: TileAttributes) {
	return (
		<div className="tile" data-x={x} data-y={y}>
			{value}
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

function generateTiles(size: number): TileAttributes[][] {
	const tiles: TileAttributes[][] = [];

	for (let i = 1; i <= size; i++) {
		tiles[i] = [];
		for (let j = 1; j <= size; j++) {
			tiles[i][j] = {
				value: 0,
				x: i,
				y: j
			}
		}
	}

	return tiles
}

export default function Board({ size }: BoardAttributes) {
	const grid = useMemo(() => generateTiles(size), [size]);

	return (
		<div className={"board "+numberToName(size)}>
			{grid.map((row, y) => 
				row.map((_, x) => (
					<Tile key={`${y}-${x}`} value={1} y={y} x={x} />
				))
			)}
		</div>
	)
}