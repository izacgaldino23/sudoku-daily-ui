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
