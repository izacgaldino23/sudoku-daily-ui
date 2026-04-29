import { useMemo } from "react"
import "./Board.scss"
import type { BoardAttributes } from "@/types/ui"
import { useGameStore } from "@/store/useGameStore"
import { getConflicts, isBoardComplete } from "@/utils/gameLogic"
import { Status } from "@/types/game"
import { BoardSizeToString } from "@/utils/board"
import Tile from "../tile/Tile"
import NumberPad from "../numberPad/NumberPad"
import { useKeyboardHandler } from "../../../hooks/board/useKeyboardHandler"
import { useVictorySubmit } from "../../../hooks/board/useVictorySubmit"

export default function Board({ size }: BoardAttributes) {
	const selectCell = useGameStore(state => state.selectCell);
	const currentState = useGameStore(state => state.state[size]);

	const conflicts = useMemo(() => {
		if (!currentState) return new Set<string>();
		return getConflicts(currentState.board);
	}, [currentState]);

	const isComplete = isBoardComplete(currentState);
	const hasConflicts = conflicts.size > 0;
	const hasInvalidAttempt = currentState?.hasInvalidAttempt ?? false;
	const isVictory = currentState && currentState.board.length > 0 && isComplete && !hasConflicts && !hasInvalidAttempt;
	const finished = currentState && currentState.status === Status.FINISHED;

	useKeyboardHandler({ size, currentState });
	useVictorySubmit({ size, currentState });

	const handleSelectCell = (row: number, col: number) => {
		if (!currentState) return;

		if (currentState.brush !== null) {
			useGameStore.getState().setValue(size, { row, col, value: currentState.brush });
		} else if (
			currentState.selectedCell?.row === row &&
			currentState.selectedCell?.col === col
		) {
			selectCell(size, { row: -1, col: -1 });
		} else {
			selectCell(size, { row, col });
		}
	}

	if (!currentState) return null;

	const selectedRow = currentState.selectedCell?.row ?? -1;
	const selectedCol = currentState.selectedCell?.col ?? -1;

	return (
		<div className="board" data-testid="game-board">
			<div className={"grid "+BoardSizeToString(size)}>
				{currentState.board.map((row, rowIndex) => 
					row.map((value, colIndex) => (
						<Tile 
							value={value} 
							key={`${rowIndex}-${colIndex}`} 
							fixed={currentState.fixed[rowIndex][colIndex]} 
							conflict={conflicts.has(`${colIndex}.${rowIndex}`)}
							selected={currentState.selectedCell?.row === rowIndex && currentState.selectedCell?.col === colIndex}
							highlightRow={selectedRow === rowIndex && selectedRow !== -1}
							highlightCol={selectedCol === colIndex && selectedCol !== -1}
							onClick={() => handleSelectCell(rowIndex, colIndex)}
							x={colIndex}
							y={rowIndex}
							size={size}
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

			{!finished && <NumberPad size={size} currentState={currentState} isVictory={!!isVictory} />}
		</div>
	)
}