import { useEffect } from "react"
import { useGameStore } from "@/store/useGameStore"
import type { BoardSize } from "@/types/game"

interface UseKeyboardHandlerProps {
	size: BoardSize
	currentState: ReturnType<typeof useGameStore.getState>['state'][BoardSize]
}

export function useKeyboardHandler({ size, currentState }: UseKeyboardHandlerProps) {
	const setValue = useGameStore(state => state.setValue);
	const clearValue = useGameStore(state => state.clearValue);
	const clearBrush = useGameStore(state => state.clearBrush);

	useEffect(() => {
		if (!currentState || !currentState.selectedCell) return;

		const { row, col } = currentState.selectedCell;

		const handleKeyDown = (event: KeyboardEvent) => {
			const value = event.key;
			if (value >= '0' && value <= '9') {
				setValue(size, { row, col, value: Number(value) });
				clearBrush(size);
			} else if (value === "Backspace" || value === "Delete") {
				clearValue(size, { row, col });
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [currentState, setValue, size, clearValue, clearBrush]);
}