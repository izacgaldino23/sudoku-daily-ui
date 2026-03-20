import { useGameStore } from "@/store/useGameStore";

export function useGame() {
	const state = useGameStore(s => s.state);
	const loadingGame = useGameStore(s => s.loadingGame);
	const loadGame = useGameStore(s => s.loadGame);
	const submitSolve = useGameStore(s => s.submitSolve);
	const selectCell = useGameStore(s => s.selectCell);
	const setValue = useGameStore(s => s.setValue);
	const clearValue = useGameStore(s => s.clearValue);

	return {
		state,
		loadingGame,
		loadGame,
		submitSolve,
		selectCell,
		setValue,
		clearValue,
	};
}
