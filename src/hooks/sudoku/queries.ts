import { useQuery } from "@tanstack/react-query";
import { fetchDailySudoku } from "@/services/sudokuApi";
import { BoardSizeToString } from "@/utils/board";
import type { BoardSize } from "@/types/game";
import { QUERY_CONFIG } from "../config";

export function useDailySudoku(size: BoardSize | null) {
    return useQuery({
        queryKey: ["sudoku", "daily", size],
        queryFn: () => fetchDailySudoku(BoardSizeToString(size!)),
        enabled: size !== null,
        staleTime: QUERY_CONFIG.staleTime,
        retry: QUERY_CONFIG.retry,
    });
}