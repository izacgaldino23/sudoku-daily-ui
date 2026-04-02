import Button from "@/components/form/button/Button";
import "./Leaderboard.scss";
import { useGetLeaderboard } from "@/hooks/leaderboard/queries";
import { Types, type entries, type LeaderboardResponse, type LeaderboardTypes } from "@/types/api/leaderboard";
import type { BoardSize } from "@/types/game";
import { BoardSizeToString } from "@/utils/board";
import { useEffect, useState } from "react";

const TYPES: { value: LeaderboardTypes; label: string }[] = [
	{ value: Types.DAILY, label: "Daily" },
	{ value: Types.ALLTIME, label: "All Time" },
	{ value: Types.STREAK, label: "Streak" },
	{ value: Types.TOTAL, label: "Total" },
];

const SIZES = [
	{ value: 4, label: "4x4" },
	{ value: 6, label: "6x6" },
	{ value: 9, label: "9x9" },
];

const needsSize = (type: LeaderboardTypes): boolean => {
	return type === Types.DAILY || type === Types.ALLTIME;
};

function getPodium(data: LeaderboardResponse): entries[] {
	let top: entries[] = [];

	if (data.solves.length < 3) {
		return [...data.solves, ...Array(3 - data.solves.length).fill({ rank: 0, username: "", value: "" })];
	} else {
		top = data.solves.slice(0, 3);
	}

	return top;
}

function getRemaining(data: LeaderboardResponse): entries[] {
	let remaining: entries[] = [];

	if (data.solves.length > 3) {
		remaining = data.solves.slice(3);
	}

	return remaining
}

export default function Leaderboard() {
	const [ topThree, setTopThree ] = useState<entries[]>([]);
	const [ remaining, setRemaining ] = useState<entries[]>([]);
	const [ page, setPage ] = useState(1);
	const [ size, setSize ] = useState<BoardSize>(9);
	const [ type, setType ] = useState<LeaderboardTypes>(Types.DAILY);

	const { isLoading, data, refetch } = useGetLeaderboard({
		type: type,
		limit: 15,
		page: page,
		size: needsSize(type) ? BoardSizeToString(size) : undefined,
	});
	const value = "solves";

	useEffect(() => {
		if (!data || !data.solves) return;

		setTopThree(getPodium(data));
		setRemaining(getRemaining(data));
	}, [data]);

	useEffect(() => {
		setPage(1);
		refetch();
	}, [type, size, refetch]);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="leaderboard">
			<h1>Leaderboard</h1>

			<div className="leaderboard_filters">
				<div className="filter_group">
					<label>Type:</label>
					<div className="filter_buttons">
						{TYPES.map((t) => (
							<Button
								key={t.value}
								text={t.label}
								className={type === t.value ? "active" : ""}
								onClick={() => setType(t.value)}
							/>
						))}
					</div>
				</div>

				{needsSize(type) && (
					<div className="filter_group">
						<label>Size:</label>
						<div className="filter_buttons">
							{SIZES.map((s) => (
								<Button
									key={s.value}
									text={s.label}
									className={size === s.value ? "active" : ""}
									onClick={() => setSize(s.value as BoardSize)}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			{!isLoading && (
				<div className="leaderboard_list">
					<section className="top-three">
						<ul>
							{topThree.map((entry, index) => (
								<li key={index}>
									<h3>{entry.username}</h3>
									<p>{entry.value} {value}</p>
									<span>{entry.rank}th place</span>
								</li>
							))}
						</ul>
					</section>

					<table>
						<thead>
							<tr>
								<th>Rank</th>
								<th>Name</th>
								<th>Score</th>
							</tr>
						</thead>
						<tbody>
							{remaining.map((entry, index) => (
								<tr key={index}>
									<td>{entry.rank}</td>
									<td>{entry.username}</td>
									<td>{entry.value} {value}</td>
								</tr>
							))}
						</tbody>
					</table>

					<nav>
						{page > 1 && (
							<Button text="Previous" className="left" />
						)}
						{data?.has_next && (
							<Button text="Next" className="right" />
						)}
					</nav>
				</div>
			)}
		</div>
	)
}