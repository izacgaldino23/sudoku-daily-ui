import { useGetProfileResume } from "@/hooks/profile/queries";
import { BoardSizeToString } from "@/utils/board";
import type { BoardSize, GameResult } from "@/types/api/auth";
import "./Profile.scss";
import { useAuthStore } from "@/store/useAuthStore";

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function Profile() {
	const { data, isLoading, error } = useGetProfileResume();
	const { state } = useAuthStore();

	const boardSizes: BoardSize[] = [4, 6, 9];

	const totalGames = (data?.TotalGames ?? {}) as Record<BoardSize, number>;
	const todayGames = (data?.TodayGames ?? {}) as Record<BoardSize, GameResult>;
	const bestTimes = (data?.BestTimes ?? {}) as Record<BoardSize, GameResult>;

	return (
		<div className="profile">
			<h1>Profile</h1>
			<p className="profile_username">Welcome, {state?.username}</p>

			{isLoading && <div className="loading">Loading...</div>}

			{error && <div className="error">Failed to load profile data</div>}

			{data && (
				<div className="profile_content">
					<section className="stats_section">
						<h2>Total Games</h2>
						<div className="stats_grid">
							{boardSizes.map((size) => (
								<div key={size} className="stat_card">
									<span className="stat_label">{BoardSizeToString(size)}</span>
									<span className="stat_value">{totalGames[size] || 0}</span>
								</div>
							))}
						</div>
					</section>

					<section className="stats_section">
						<h2>Today's Games</h2>
						<div className="stats_grid">
							{boardSizes.map((size) => {
								const game = todayGames[size];
								return (
									<div key={size} className={`stat_card ${game?.Finished ? "finished" : ""}`}>
										<span className="stat_label">{BoardSizeToString(size)}</span>
										<span className="stat_value">
											{game ? (game.Finished ? formatTime(game.Time) : "In progress") : "Not played"}
										</span>
									</div>
								);
							})}
						</div>
					</section>

					<section className="stats_section">
						<h2>Best Times</h2>
						<div className="stats_grid">
							{boardSizes.map((size) => {
								const game = bestTimes[size];
								return (
									<div key={size} className="stat_card best_time">
										<span className="stat_label">{BoardSizeToString(size)}</span>
										<span className="stat_value">
											{game?.Finished ? formatTime(game.Time) : "-"}
										</span>
									</div>
								);
							})}
						</div>
					</section>
				</div>
			)}
		</div>
	);
}
