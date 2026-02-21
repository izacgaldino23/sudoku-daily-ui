import type { GameContextType } from "@/types/GameTypes";
import { createContext, useContext } from "react";

export const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame(): GameContextType {
	const context = useContext(GameContext);
	if (!context) throw new Error("useGame must be used within a GameProvider");
	return context;
}