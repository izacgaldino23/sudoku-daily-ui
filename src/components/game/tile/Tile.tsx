import { getCornerReference } from "@/utils/board";
import { useRef, useState, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import "./Tile.scss"
import type { TileAttributes } from "@/types/ui"

export default function Tile({ value, x, y, fixed, onClick, selected, conflict, size, highlightRow, highlightCol }: TileAttributes) {
	const [pop, setPop] = useState(false);
	const prevValueRef = useRef(value);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const clearTimer = useCallback(() => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
	}, []);

	useEffect(() => {
		clearTimer();
		if (value !== 0 && prevValueRef.current !== undefined && value !== prevValueRef.current) {
			flushSync(() => setPop(true));
			timerRef.current = setTimeout(() => {
				setPop(false);
			}, 300);
		}
		prevValueRef.current = value;
		return clearTimer;
	}, [value, clearTimer]);

	const classes = ['tile'];
	if (fixed) classes.push('filled');
	if (selected) classes.push('selected');
	if (conflict) classes.push('conflict');
	if (pop) classes.push('pop');
	if (highlightRow) classes.push('highlight-row');
	if (highlightCol) classes.push('highlight-col');
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