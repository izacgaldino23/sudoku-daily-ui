import { useMemo } from "react"
import Button from "../../form/button/Button"
import { Eraser } from "lucide-react"
import { useGameStore } from "@/store/useGameStore"
import type { BoardSize } from "@/types/game"
import "./NumberPad.scss"

interface NumberPadProps {
	size: BoardSize
	currentState: ReturnType<typeof useGameStore.getState>['state'][BoardSize]
	isVictory: boolean
}

export default function NumberPad({ size, currentState, isVictory }: NumberPadProps) {
	const setValue = useGameStore(state => state.setValue);
	const clearValue = useGameStore(state => state.clearValue);
	const setBrush = useGameStore(state => state.setBrush);
	const clearBrush = useGameStore(state => state.clearBrush);

	const buttonsLabels = useMemo(() => {
		const labels: string[] = [];
		for (let i = 1; i <= size; i++) {
			labels.push(`${i}`);
		}
		return labels;
	}, [size]);

	const handleNumberClick = (value: number) => {
		if (!currentState) return;

		const selectedCell = currentState.selectedCell;
		const hasSelectedCell = selectedCell && 
			selectedCell.row >= 0 && 
			selectedCell.col >= 0;

		if (hasSelectedCell) {
			setValue(size, { row: selectedCell.row, col: selectedCell.col, value });
			return;
		}

		if (currentState.brush === value) {
			clearBrush(size);
			return;
		}

		setBrush(size, value);
	}

	const handleEraserClick = () => {
		if (!currentState) return;

		const selectedCell = currentState.selectedCell;
		const hasSelectedCell = selectedCell && 
			selectedCell.row >= 0 && 
			selectedCell.col >= 0;

		if (hasSelectedCell) {
			clearValue(size, { row: selectedCell.row, col: selectedCell.col });
			return;
		}

		if (currentState.brush === 0) {
			clearBrush(size);
			return;
		}

		setBrush(size, 0);
	}

	if (!currentState) return null;

	return (
		<div className="buttons">
			{buttonsLabels.map((label) => (
				<Button 
					className={`square ${currentState.brush === Number(label) ? 'active' : ''}`} 
					key={label} 
					text={label} 
					onClick={() => handleNumberClick(Number(label))}
				/>
			))}
			<Button className={`eraser square ${currentState.brush === 0 ? 'active' : ''}`} onClick={handleEraserClick} text="" disabled={isVictory}>
				<Eraser />
			</Button>
		</div>
	)
}