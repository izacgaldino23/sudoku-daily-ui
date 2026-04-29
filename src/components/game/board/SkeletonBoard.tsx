import "./SkeletonBoard.scss"
import type { BoardSize } from "@/types/game"

interface SkeletonBoardProps {
	size: BoardSize
}

export default function SkeletonBoard({ size }: SkeletonBoardProps) {
	const tiles = Array.from({ length: size * size }, (_, i) => {
		const row = Math.floor(i / size);
		const col = i % size;
		return { key: i, x: col, y: row };
	});

	return (
		<div className={`skeleton-board ${size === 4 ? 'four' : size === 6 ? 'six' : 'nine'}`} data-testid="skeleton-board">
			{tiles.map(({ key, x, y }) => (
				<div 
					key={key} 
					className="skeleton-tile"
					data-x={x}
					data-y={y}
				/>
			))}
		</div>
	)
}
