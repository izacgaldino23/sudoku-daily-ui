import { getCornerReference } from "@/utils/board";
import "./Tile.scss"
import type { TileAttributes } from "@/types/ui"

export default function Tile({ value, x, y, fixed, onClick, selected, conflict, size }: TileAttributes) {
	const classes = ['tile'];
	if (fixed) classes.push('filled');
	if (selected) classes.push('selected');
	if (conflict) classes.push('conflict');
	classes.push('corner', getCornerReference(size, x, y));

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