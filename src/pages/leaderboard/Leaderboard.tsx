import "./Leaderboard.scss";

export default function Leaderboard() {
	return (
		<div className="leaderboard">
			<h1>Leaderboard</h1>

			<div className="leaderboard_list">
				<section className="top-three">
					<ul>
						<li>
							<h3>Name</h3>
							<span>1th place</span>
							<p>Score</p>
						</li>
						<li>
							<h3>Name 2</h3>
							<span>2th place</span>
							<p>Score</p>
						</li>
						<li>
							<h3>Name 3</h3>
							<span>3th place</span>
							<p>Score</p>
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
					<button>Previous</button>
					<button>Next</button>
				</nav>
			</div>
		</div>
	)
}