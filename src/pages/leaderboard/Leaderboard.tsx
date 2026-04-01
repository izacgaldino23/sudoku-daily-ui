import Button from "@/components/form/button/Button";
import "./Leaderboard.scss";
import { useGetLeaderboard } from "@/hooks/leaderboard/queries";
import { Types, type entries, type LeaderboardResponse } from "@/types/api/leaderboard";
import { BoardSizeToString } from "@/utils/board";
import { useEffect, useState } from "react";

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
	const [ page ] = useState(1);
	const [ size ] = useState(BoardSizeToString(9));
	const [ type ] = useState(Types.TOTAL);

	const { isLoading, data } = useGetLeaderboard({
		type: type,
		limit: 15,
		page: page,
		size: size,
	});
	const value = "solves";

	useEffect(() => {
		if (!data || !data.solves) return;

		setTopThree(getPodium(data));
		setRemaining(getRemaining(data));
	}, [data]);

	if (isLoading) return <div>Loading...</div>;

	return (
		<div className="leaderboard">
			<h1>Leaderboard</h1>

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
									<td>{entry.value}</td>
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