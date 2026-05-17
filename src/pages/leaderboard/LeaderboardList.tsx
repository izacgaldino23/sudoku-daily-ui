import Button from "@/components/form/button/Button";
import { memo } from "react";
import { UnitTypes, type entries, type LeaderboardUnitTypes } from "@/types/api/leaderboard";
import { SecondsToClock } from "@/utils/gameLogic";

interface LeaderboardListProps {
	topThree: entries[];
	remaining: entries[];
	page: number;
	hasNext?: boolean;
	unit: LeaderboardUnitTypes;
}

function formatUnit(value: string, unit: LeaderboardUnitTypes): string {
	if (unit === UnitTypes.TIME) {
		const seconds = value == "" ? 0 : parseInt(value, 10);
		return unitTimeFormatter(seconds);
	}

	return `${value} solves`;
}

function unitTimeFormatter(seconds: number): string {
	const { hours, minutes, remainingSeconds } = SecondsToClock(seconds)

	return `${hours > 0 ? `${hours}h ` : ""}${minutes > 0 ? `${minutes}m ` : ""}${remainingSeconds}s`;
}

export const LeaderboardList = memo(function LeaderboardList({ topThree, remaining, page, hasNext, unit }: LeaderboardListProps) {
	return (
		<div className="leaderboard_list">
			<section className="top-three">
				{(topThree && topThree[0].username != "") ? (<ul>
					{topThree.map((entry, index) => (
						<li key={index} className={entry.rank == 0 ? 'empty' : ''}>
							<h3>{entry.username}</h3>
							<p>{formatUnit(entry.value, unit)}</p>
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
							<td>{formatUnit(entry.value, unit)}</td>
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