import { useGetLeaderboard } from "@/hooks/leaderboard/queries";
import { Types, type entries, type LeaderboardTypes } from "@/types/api/leaderboard";
import type { BoardSize } from "@/types/game";
import { BoardSizeToString } from "@/utils/board";
import "./Leaderboard.scss";
import { useMemo, useState } from "react";
import { FilterGroup } from "./FilterGroup";
import { LeaderboardList } from "./LeaderboardList";

const TYPES: { value: LeaderboardTypes; label: string }[] = [
	{ value: Types.DAILY, label: "Daily" },
	{ value: Types.ALLTIME, label: "All Time" },
	{ value: Types.STREAK, label: "Streak" },
	{ value: Types.TOTAL, label: "Total" },
];

const SIZES = [
	{ value: "4", label: "4x4" },
	{ value: "6", label: "6x6" },
	{ value: "9", label: "9x9" },
];

const needsSize = (type: LeaderboardTypes): boolean => {
	return type === Types.DAILY || type === Types.ALLTIME;
};

const getPodium = (solves: entries[]): entries[] => {
	if (solves.length < 3) {
		return [...solves, ...Array(3 - solves.length).fill({ rank: 0, username: "", value: "" })];
	}
	return solves.slice(0, 3);
};

const getRemaining = (solves: entries[]): entries[] => {
	return solves.length > 3 ? solves.slice(3) : [];
};

export default function Leaderboard() {
	const [ page, setPage ] = useState(1);
	const [ size, setSize ] = useState<BoardSize>(9);
	const [ type, setType ] = useState<LeaderboardTypes>(Types.DAILY);

	const queryParams = useMemo(() => ({
		type: type,
		limit: 15,
		page: page,
		size: needsSize(type) ? BoardSizeToString(size) : undefined,
	}), [type, size, page]);

	const { isLoading, isFetching, data } = useGetLeaderboard(queryParams);

	const solves = useMemo(() => data?.solves ?? [], [data]);
	const topThree = useMemo(() => getPodium(solves), [solves]);
	const remaining = useMemo(() => getRemaining(solves), [solves]);

	const handleTypeChange = (newType: string) => {
		setType(newType as LeaderboardTypes);
		setPage(1);
	};

	const handleSizeChange = (newSize: string) => {
		setSize(parseInt(newSize) as BoardSize);
		setPage(1);
	};

	return (
		<div className="leaderboard">
			<h1>Leaderboard</h1>

			<div className="leaderboard_filters">
				<FilterGroup
					label="Type"
					options={TYPES.map(t => ({ value: t.value, label: t.label }))}
					value={type}
					onChange={handleTypeChange}
				/>
				{needsSize(type) && (
					<FilterGroup
						label="Size"
						options={SIZES}
						value={String(size)}
						onChange={handleSizeChange}
					/>
				)}
			</div>

			{(isLoading || isFetching) ? (
				<div>Loading...</div>
			) : (
				<LeaderboardList
					topThree={topThree}
					remaining={remaining}
					page={page}
					hasNext={data?.has_next}
				/>
			)}
		</div>
	);
}