import { fetchSudokuBySize, type DailySudokuResponse } from "./apiMock";

export async function fetchDailySudoku(size: number): Promise<DailySudokuResponse> {
  return fetchSudokuBySize(size)
}