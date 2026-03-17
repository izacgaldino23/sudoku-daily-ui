import { useQuery } from "@tanstack/react-query";
import { fetchDailySudoku } from "@/services/sudokuApi";
import { BoardSizeToString } from "@/utils/board";
import type { BoardSize } from "@/types/game";

export function useDailySudoku(size: BoardSize | null) {
    return useQuery({
        queryKey: ["dailySudoku", size],
        queryFn: () => fetchDailySudoku(BoardSizeToString(size!)),
        enabled: size !== null,
        staleTime: Infinity,
        retry: false,
    });
}