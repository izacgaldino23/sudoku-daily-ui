import { useQuery } from "@tanstack/react-query";
import { fetchDailySudoku } from "@/services/api";
import { BoardSizeToString, type BoardSize } from "@/types/GameTypes";

export function useDailySudoku(size: BoardSize | null) {
    return useQuery({
        queryKey: ["dailySudoku", size],
        queryFn: () => fetchDailySudoku(BoardSizeToString(size!)),
        enabled: size !== null,
        staleTime: Infinity,
        retry: false,
    });
}