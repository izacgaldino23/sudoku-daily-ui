import Button from "@/components/form/button/Button";
import { memo } from "react";
import type { entries } from "@/types/api/leaderboard";

interface LeaderboardListProps {
	topThree: entries[];
	remaining: entries[];
	page: number;
	hasNext?: boolean;
}

export const LeaderboardList = memo(function LeaderboardList({ topThree, remaining, page, hasNext }: LeaderboardListProps) {
	return (
		<div className="leaderboard_list">
			<section className="top-three">
				{(topThree && topThree[0].username != "") ? (<ul>
					{topThree.map((entry, index) => (
						<li key={index} className={entry.rank == 0 ? 'empty' : ''}>
							<h3>{entry.username}</h3>
							<p>{entry.value} solves</p>
							<span>{entry.rank}th place</span>
						</li>
					))}
				</ul>) : (<p className="loading">Nothing here</p>)}
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
							<td>{entry.value} solves</td>
						</tr>
					))}
				</tbody>
			</table>

			<nav>
				{page > 1 && <Button text="Previous" className="left" />}
				{hasNext && <Button text="Next" className="right" />}
			</nav>
		</div>
	);
});