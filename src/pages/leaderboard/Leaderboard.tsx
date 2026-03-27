import Button from "@/components/form/button/Button";
import "./Leaderboard.scss";
import { useGetLeaderboard } from "@/hooks/leaderboard/queries";
import { Types } from "@/types/api/leaderboard";
import { BoardSizeToString } from "@/utils/board";

export default function Leaderboard() {
	const { isLoading } = useGetLeaderboard({
		type: Types.TOTAL,
		limit: 15,
		page: 1,
		size: BoardSizeToString(9),
	});

	if (isLoading) return <div>Loading...</div>;


	return (
		<div className="leaderboard">
			<h1>Leaderboard</h1>

			{!isLoading && (
				<div className="leaderboard_list">
					<section className="top-three">
						<ul>
							<li>
								<h3>Name</h3>
								<p>Score</p>
								<span>1th place</span>
							</li>
							<li>
								<h3>Name 2</h3>
								<p>Score</p>
								<span>2th place</span>
							</li>
							<li>
								<h3>Name 3</h3>
								<p>Score</p>
								<span>3th place</span>
							</li>
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
							<tr>
								<td>#4</td>
								<td>Name</td>
								<td>Score</td>
							</tr>
							<tr>
								<td>#5</td>
								<td>Name</td>
								<td>Score</td>
							</tr>
							<tr>
								<td>#6</td>
								<td>Name</td>
								<td>Score</td>
							</tr>
						</tbody>
					</table>

					<nav>
						<Button text="Previous" className="left" />
						<Button text="Next" className="right" />
					</nav>
				</div>
			)}
		</div>
	)
}