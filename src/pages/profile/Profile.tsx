import { useGetProfileResume } from "@/hooks/profile/queries";
import { BoardSizeToDisplayString } from "@/utils/board";
import type { BoardSize, GameResult } from "@/types/api/auth";
import "./Profile.scss";
import { useAuthStore } from "@/store/useAuthStore";

function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function findGameBySize(games: GameResult[], size: BoardSize): GameResult | undefined {
	return games.find((g) => g.size === size);
}

export default function Profile() {
	const { data, isLoading, error } = useGetProfileResume();
	const { state } = useAuthStore();

	const boardSizes: BoardSize[] = [4, 6, 9];

	const todayGames = data?.today_games ?? [];
	const bestTimes = data?.best_times ?? [];
	const totalGames = (data?.total_games ?? {}) as Record<BoardSize, number>;

	return (
		<div className="profile">
			<h1>Profile</h1>
			<p className="profile_username">Welcome, <strong>{state?.username}</strong></p>

			{isLoading && <div className="loading">Loading...</div>}

			{error && <div className="error">Failed to load profile data</div>}

			{data && (
				<div className="profile_content">
					{boardSizes.map((size) => {
						const today = findGameBySize(todayGames, size);
						const best = findGameBySize(bestTimes, size);
						const total = totalGames[size] || 0;

						const hasToday = today?.finished;
						const hasBest = best?.finished;

						return (
							<div
								key={size}
								className={`stat_row ${hasToday ? "has_today" : ""} ${hasBest ? "has_best" : ""}`}
							>
								<span className="stat_size">{BoardSizeToDisplayString(size)}</span>
								<div className="stat_details">
									<div className="stat_item">
										<span className="stat_item_label">Total</span>
										<span className="stat_item_value">{total}</span>
									</div>
									<div className="stat_item">
										<span className="stat_item_label">Today</span>
										<span className="stat_item_value">
											{today?.finished ? formatTime(today.time) : "-"}
										</span>
									</div>
									<div className="stat_item">
										<span className="stat_item_label">Best</span>
										<span className="stat_item_value">
											{best?.finished ? formatTime(best.time) : "-"}
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
