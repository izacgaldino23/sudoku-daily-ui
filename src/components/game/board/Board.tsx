import { useEffect, useMemo, useRef } from "react"
import "./Board.scss"
import Button from "../../form/button/Button"
import { Eraser } from "lucide-react"
import type { BoardAttributes, TileAttributes } from "@/types/ui"
import { useGameStore } from "@/store/useGameStore"
import { getConflicts, isBoardComplete } from "@/utils/gameLogic"
import { Status, type BoardSize } from "@/types/game"
import { BoardSizeToString } from "@/utils/board"
import { useSubmitSudokuSolve } from "@/hooks/sudoku/mutations"
import { getErrorMessage } from "@/types/errors"
import { useAlertStore } from "@/store/useAlertStore"

function getCornerReference(size: BoardSize, x: number, y: number) {
	if (x === 0 && y === 0) return "corner top-left";
	else if (x === size - 1 && y === 0) return "corner top-right";
	else if (x === 0 && y === size - 1) return "corner bottom-left";
	else if (x === size - 1 && y === size - 1) return "corner bottom-right";

	return "";
}

function Tile({ value, x, y, fixed, onClick, selected, conflict, size }: TileAttributes) {
	const classes = ['tile'];
	if (fixed) classes.push('filled');
	if (selected && !fixed) classes.push('selected');
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

export default function Board({ size }: BoardAttributes) {
	const state = useGameStore(state => state.state);
	const selectCell = useGameStore(state => state.selectCell);
	const setValue = useGameStore(state => state.setValue);
	const finishGame = useGameStore(state => state.finishGame);
	const clearValue = useGameStore(state => state.clearValue);
	const setBrush = useGameStore(state => state.setBrush);
	const clearBrush = useGameStore(state => state.clearBrush);
	const currentState = state[size];

	const conflicts = useMemo(() => {
		if (!currentState) return new Set<string>();
		return getConflicts(currentState.board);
	}, [currentState]);

	const isComplete = isBoardComplete(currentState);
	const hasConflicts = conflicts.size > 0;
	const isVictory = currentState && currentState.board.length > 0 && isComplete && !hasConflicts;
	const finished = currentState && currentState.status === Status.FINISHED;

	const submitSolveMutation = useSubmitSudokuSolve();
	const hasSubmittedRef = useRef(false);

	useEffect(() => {
		if (isVictory && !finished && !hasSubmittedRef.current) {
			hasSubmittedRef.current = true;
			submitSolveMutation.mutate({
				play_token: currentState.session_token,
				solution: currentState.board,
			}, {
				onSuccess: () => {
					finishGame(size);
				},
				onError: (error) => {
					useAlertStore.getState().pushAlert(getErrorMessage(error as Error), "error");
				},
			})
		}
	}, [submitSolveMutation, isVictory, finished, currentState?.session_token, currentState?.board, finishGame, size]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!currentState || !currentState.selectedCell) return;

			const value = event.key;
			if (value >= '0' && value <= '9') {
				setValue(size, { ...currentState.selectedCell, value: Number(value) });
				clearBrush(size);
			} else if (value === "Backspace" || value === "Delete") {
				clearValue(size, { ...currentState.selectedCell });
			}
		};

		window.addEventListener('keydown', handleKeyDown);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [currentState, setValue, size, clearValue, clearBrush]);

	const buttonsLabels = useMemo(() => {
		const labels: string[] = [];
		for (let i = 1; i <= size; i++) {
			labels.push(`${i}`);
		}
		return labels;
	}, [size]);

	const handleSelectCell = (row: number, col: number) => {
		if (!currentState) return;

		if (currentState.brush !== null) {
			setValue(size, { row, col, value: currentState.brush });
		} else if (
			currentState.selectedCell?.row === row &&
			currentState.selectedCell?.col === col
		) {
			selectCell(size, { row: -1, col: -1 });
		} else {
			selectCell(size, { row, col });
		}
	}

	const handleNumberClick = (value: number) => {
		if (!currentState) return;

		const hasSelectedCell = currentState.selectedCell && 
			currentState.selectedCell.row >= 0 && 
			currentState.selectedCell.col >= 0;

		if (hasSelectedCell) {
			setValue(size, { ...currentState.selectedCell!, value });
		} else if (currentState.brush === value) {
			clearBrush(size);
		} else {
			setBrush(size, value);
		}
	}

	const handleEraserClick = () => {
		if (!currentState) return;

		const hasSelectedCell = currentState.selectedCell && 
			currentState.selectedCell.row >= 0 && 
			currentState.selectedCell.col >= 0;

		if (hasSelectedCell) {
			clearValue(size, { ...currentState.selectedCell! });
		} else if (currentState.brush === 0) {
			clearBrush(size);
		} else {
			setBrush(size, 0);
		}
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

			{!finished && <div className="buttons">
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
			</div>}
		</div>
	)
}