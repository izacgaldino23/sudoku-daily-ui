import { useGame } from "@/context";
import type { BoardSize } from "@/types/GameTypes";
import { mapFromResponse } from "@/utils/mappers";
import { useEffect, useRef, useState } from "react";
import { useDailySudoku } from "./queries/useDailySudoku";
import { Status } from "@/types/GameTypes";
import { getErrorMessage } from "@/services/errors";
import { useAlert } from "@/context/alert/AlertContext";

export function useSudoku() {
	const { state, dispatch } = useGame();
	
	const [ size , setSize ] = useState<BoardSize | null>(null);

	const { data, isLoading, isError, error } = useDailySudoku(size);

	const { pushAlert } = useAlert();

	const errorShownRef = useRef(false);

	useEffect(() => {
		errorShownRef.current = false;
	}, [size]);

	useEffect(() => {
		if (isError && !errorShownRef.current) {
			errorShownRef.current = true;
			pushAlert(getErrorMessage(error), "error");
		}
	}, [isError, error, pushAlert]);

	useEffect(() => {
		if (!data || !size) return;

		const dataMapped = mapFromResponse(data);

		dispatch({
			type: "START_GAME",
			size,
			payload: {
				board: dataMapped.values,
				fixed: dataMapped.fixed,
				session_token: dataMapped.session_token
			}
		});
	}, [data, size, dispatch]);

	function loadGame(newSize: BoardSize) {
		if (state[newSize]?.status === Status.PLAYING) {
			return;
		}

		dispatch({
			type: "LOADING_GAME",
			size: newSize 
		});
		setSize(newSize);
	}

	return {
		loading: isLoading,
		loadGame,
	}
}