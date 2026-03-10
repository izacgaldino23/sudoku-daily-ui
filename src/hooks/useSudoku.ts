import { useGame } from "@/context/useGame";
import type { BoardSize } from "@/types/GameTypes";
import { mapFromResponse } from "@/utils/mappers";
import { useEffect, useState } from "react";
import { useDailySudoku } from "./queries/useDailySudoku";

export function useSudoku() {
	const { dispatch } = useGame();
	
	const [ size , setSize ] = useState<BoardSize | null>(null);

	const { data, isLoading, error } = useDailySudoku(size);

	useEffect(() => {
		if (!data || !size) return;

		const dataMapped = mapFromResponse(data);

		dispatch({
			type: "START_GAME",
			size,
			payload: {
				board: dataMapped.values,
				fixed: dataMapped.fixed
			}
		});
	}, [data, size, dispatch]);

	function loadGame(newSize: BoardSize) {
		dispatch({
			type: "LOADING_GAME",
			size: newSize 
		});
		setSize(newSize);
	}

	return {
		loading: isLoading,
		loadGame,
		error,
	}
}