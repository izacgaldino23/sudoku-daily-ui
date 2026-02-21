import type { GameState } from "@/types/GameTypes";
import { useReducer } from "react";
import { gameReducer } from "./gameReducer";
import { GameContext } from "./useGame";

const initialState: GameState = {
	size: 4,
	board: [],
	fixed: [],
	selectedCell: null,
	seconds: 0,
	status: "playing",
}

export function GameProvider({children}: {children: React.ReactNode}) {
	const [ state, dispatch ] = useReducer(gameReducer, initialState);

	return (
		<GameContext.Provider value={{ state, dispatch }} >
			{children}
		</GameContext.Provider>
	)
}