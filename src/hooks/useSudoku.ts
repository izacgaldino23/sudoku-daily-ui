import { useGame } from "@/context/useGame";
import { fetchDailySudoku } from "@/services/api";
import type { BoardSize } from "@/types/GameTypes";
import { mapFromResponse } from "@/utils/mappers";
import { useState } from "react";

export function useSudoku() {
	const { dispatch } = useGame();
	const [ loading, setLoading ] = useState(false);

	async function loadGame(size: BoardSize) {
		setLoading(true);

		dispatch({ type: "LOADING_GAME", size });

		try {
			const response = await fetchDailySudoku(size);

			const data = mapFromResponse(response)
			
			dispatch({ type: "START_GAME", size, payload: { board: data.values, fixed: data.fixed} })
	
			setLoading(false);
		} catch (error) {
			console.error(error); // TODO: handle error
		} finally {
			setLoading(false);
		}

	}

	return { loading, loadGame }
}