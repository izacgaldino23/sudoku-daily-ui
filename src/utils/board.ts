import type { BoardSize } from "@/types/game"

export function BoardSizeToString(size: BoardSize) {
	switch (size) {
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

export function BoardSizeToDisplayString(size: BoardSize) {
	return `${size}x${size}`;
}

export function getCornerReference(size: BoardSize, x: number, y: number) {
	if (x === 0 && y === 0) return "corner top-left";
	else if (x === size - 1 && y === 0) return "corner top-right";
	else if (x === 0 && y === size - 1) return "corner bottom-left";
	else if (x === size - 1 && y === size - 1) return "corner bottom-right";

	return "";
}