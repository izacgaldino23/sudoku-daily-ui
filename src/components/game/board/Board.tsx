import { useEffect, useMemo } from "react"
import "./Board.scss"
import Button from "../../form/button/Button"
import { Eraser } from "lucide-react"
import type { BoardAttributes, TileAttributes } from "@/types/ui"
import { useGameStore } from "@/store/useGameStore"
import { getConflicts, isBoardComplete } from "@/utils/gameLogic"
import { useGame } from "@/hooks/sudoku/useGame"
import { Status } from "@/types/game"
import { BoardSizeToString } from "@/utils/board"

function Tile({ value, x, y, fixed, onClick, selected, conflict }: TileAttributes) {
	const classes = ['tile'];
	if (fixed) classes.push('filled');
	if (selected && !fixed) classes.push('selected');
	if (conflict) classes.push('conflict');

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

export default function Board({ size }: BoardAttributes) {
	const state = useGameStore(state => state.state);
	const selectCell = useGameStore(state => state.selectCell);
	const setValue = useGameStore(state => state.setValue);
	const currentState = state[size];

	const conflicts = useMemo(() => {
		if (!currentState) return new Set<string>();
		return getConflicts(currentState.board);
	}, [currentState]);

	const isComplete = isBoardComplete(currentState);
	const hasConflicts = conflicts.size > 0;
	const isVictory = currentState && currentState.board.length > 0 && isComplete && !hasConflicts;
	const finished = currentState && currentState.status === Status.FINISHED;

	const { submitSolve } = useGame();

	useEffect(() => {
		if (isVictory && !finished) {
			submitSolve(size);
		}
	}, [submitSolve, isVictory, finished, size]);

	const buttonsLabels = useMemo(() => {
		const labels: string[] = [];
		for (let i = 1; i <= size; i++) {
			labels.push(`${i}`);
		}
		return labels;
	}, [size]);

	const handleSelectCell = (row: number, col: number) => {
		selectCell(size, { row, col });
	}

	const handleSetValue = (value: string) => {
		if (!currentState || !currentState.selectedCell) return;

		let payload_value = value;
		if (value === "") payload_value = "0";

		setValue(size, { ...currentState.selectedCell, value: Number(payload_value) });
	}

	if (!currentState) return null;

	return (
		<div className="board">
			<div className={"grid "+BoardSizeToString(size)}>
				{currentState.board.map((row, rowIndex) => 
					row.map((value, colIndex) => (
						<Tile 
							value={value} 
							key={`${rowIndex}-${colIndex}`} 
							fixed={currentState.fixed[rowIndex][colIndex]} 
							conflict={conflicts.has(`${colIndex}.${rowIndex}`)}
							selected={currentState.selectedCell?.row === rowIndex && currentState.selectedCell?.col === colIndex}
							onClick={() => handleSelectCell(rowIndex, colIndex)}
							x={colIndex}
							y={rowIndex}
							/>
					))
				)}
			</div>

			{finished && (
				<div className="victory">
					<div className="title">Parabéns!</div>
					<div className="subtitle">Você completou o sudoku</div>
				</div>
			)}

			{!finished && <div className="buttons">
				{buttonsLabels.map((label) => (
					<Button className="square" key={label} text={label} onClick={handleSetValue}/>
				))}
				<Button className="eraser square" onClick={handleSetValue} text="" disabled={isVictory}>
					<Eraser />
				</Button>
			</div>}
		</div>
	)
}