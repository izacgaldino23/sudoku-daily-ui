import { describe, it, expect } from "vitest";
import { getConflicts, isBoardComplete, SecondsToClock } from "@/utils/gameLogic";
import type { GameData } from "@/types/game";

describe("getConflicts", () => {
	it("returns empty set for empty 4x4 board", () => {
		const board = [
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		];
		expect(getConflicts(board)).toEqual(new Set());
	});

	it("detects row conflicts in 4x4", () => {
		const board = [
			[1, 1, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		];
		const conflicts = getConflicts(board);
		expect(conflicts.has("0.0")).toBe(true);
		expect(conflicts.has("1.0")).toBe(true);
	});

	it("detects column conflicts in 4x4", () => {
		const board = [
			[1, 0, 0, 0],
			[1, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		];
		const conflicts = getConflicts(board);
		expect(conflicts.has("0.0")).toBe(true);
		expect(conflicts.has("0.1")).toBe(true);
	});

	it("detects grid conflicts (2x2 grid in 4x4)", () => {
		const board = [
			[1, 0, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		];
		const conflicts = getConflicts(board);
		expect(conflicts.has("0.0")).toBe(true);
		expect(conflicts.has("2.0")).toBe(true);
	});

	it("handles 9x9 board with no conflicts", () => {
		const board = [
			[5, 3, 4, 6, 7, 8, 9, 1, 2],
			[6, 7, 2, 1, 9, 5, 3, 4, 8],
			[1, 9, 8, 3, 4, 2, 5, 6, 7],
			[8, 5, 9, 7, 6, 1, 4, 2, 3],
			[4, 2, 6, 8, 5, 3, 7, 9, 1],
			[7, 1, 3, 9, 2, 4, 8, 5, 6],
			[9, 6, 1, 5, 3, 7, 2, 8, 4],
			[2, 8, 7, 4, 1, 9, 6, 3, 5],
			[3, 4, 5, 2, 8, 6, 1, 7, 9],
		];
		expect(getConflicts(board)).toEqual(new Set());
	});

	it("ignores zeros when detecting conflicts in 4x4", () => {
		const board = [
			[1, 0, 0, 0],
			[0, 0, 1, 0],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		];
		expect(getConflicts(board)).toEqual(new Set());
	});
});

describe("isBoardComplete", () => {
	it("returns false for undefined state", () => {
		expect(isBoardComplete(undefined)).toBe(false);
	});

	it("returns false when board has zeros", () => {
		const state: GameData = {
			board: [[1, 0], [0, 0]],
			fixed: [[true, false], [false, false]],
			session_token: "test",
			selectedCell: null,
			brush: null,
			startTime: 0,
			status: "playing",
			hasInvalidAttempt: false,
		};
		expect(isBoardComplete(state)).toBe(false);
	});

	it("returns true when board is full", () => {
		const state: GameData = {
			board: [[1, 2], [3, 4]],
			fixed: [[true, false], [false, false]],
			session_token: "test",
			selectedCell: null,
			brush: null,
			startTime: 0,
			status: "playing",
			hasInvalidAttempt: false,
		};
		expect(isBoardComplete(state)).toBe(true);
	});
});

describe("SecondsToClock", () => {
	it("converts 0 seconds", () => {
		expect(SecondsToClock(0)).toEqual({ hours: 0, minutes: 0, remainingSeconds: 0 });
	});

	it("converts seconds less than a minute", () => {
		expect(SecondsToClock(45)).toEqual({ hours: 0, minutes: 0, remainingSeconds: 45 });
	});

	it("converts seconds to minutes", () => {
		expect(SecondsToClock(125)).toEqual({ hours: 0, minutes: 2, remainingSeconds: 5 });
	});

	it("converts seconds to hours", () => {
		expect(SecondsToClock(3665)).toEqual({ hours: 1, minutes: 1, remainingSeconds: 5 });
	});

	it("handles exact hour", () => {
		expect(SecondsToClock(3600)).toEqual({ hours: 1, minutes: 0, remainingSeconds: 0 });
	});

	it("handles exact minute", () => {
		expect(SecondsToClock(180)).toEqual({ hours: 0, minutes: 3, remainingSeconds: 0 });
	});
});
