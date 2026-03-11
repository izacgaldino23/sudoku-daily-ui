import type { GameState } from "@/types/GameTypes";
import { useReducer, useEffect, useRef } from "react";
import { gameReducer } from "./gameReducer";
import { GameContext } from "./GameContext";
import { getGameState, setGameState } from "./gameStorage";

const initialState: GameState = getGameState() ?? {};

export function GameProvider({children}: {children: React.ReactNode}) {
	const [ state, dispatch ] = useReducer(gameReducer, initialState);
	const prevStateRef = useRef(state);

	useEffect(() => {
		if (state !== prevStateRef.current) {
			prevStateRef.current = state;
			setGameState(state);
		}
	}, [state]);

	return (
		<GameContext.Provider value={{ state, dispatch }} >
			{children}
		</GameContext.Provider>
	)
}
