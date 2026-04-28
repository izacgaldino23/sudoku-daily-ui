import { Crown, Timer } from 'lucide-react'
import './Play.scss'
import Board from '@/components/game/board/Board'
import SkeletonBoard from '@/components/game/board/SkeletonBoard'
import { useEffect, useMemo, useState } from 'react';
import type { PlayAttributes } from '@/types/ui';
import Button from '@/components/form/button/Button';
import { Status } from '@/types/game';
import { useGameStore } from '@/store/useGameStore';
import { SecondsToClock } from '@/utils/gameLogic';
import { BoardSizeToString } from '@/utils/board';
import { mapSudokuFromResponse } from '@/utils/mappers';
import { useDailySudoku, useGetDailySolves } from '@/hooks/sudoku/mutations';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';

function calcSeconds(startTime?: number, endTime?: number) {
	if (!startTime) return 0;
	const endTimeCalculated = endTime || Date.now();
	return (endTimeCalculated - startTime) / 1000
}

function zeroPad(num: number) {
	return String(num).padStart(2, '0');
}

export default function Play({ size }: PlayAttributes) {
	const state = useGameStore(s => s.state);
	const setPuzzle = useGameStore(s => s.setPuzzle);
	const loadingGame = useGameStore(s => s.loadingGame);
	const removeGame = useGameStore(s => s.removeGame);
	const loadSolve = useGameStore(s => s.loadSolve);

	const dailySudokuMutation = useDailySudoku();
	const getDailySolves = useGetDailySolves();

	const currentState = state[size];

	const isStarted = currentState && currentState.status === Status.PLAYING;
	const isFinished = currentState && currentState.status === Status.FINISHED;
	const isLoading = currentState && currentState.status === Status.LOADING;
	
	const [seconds, setSeconds] = useState(() => calcSeconds(currentState?.startTime, currentState?.endTime));

	const justLoggedIn = useAuthStore(s => s.justLoggedIn);
	const setJustLoggedIn = useAuthStore(s => s.setJustLoggedIn);

	useEffect(() => {
		setSeconds(calcSeconds(currentState?.startTime, currentState?.endTime));
	}, [currentState?.startTime, currentState?.endTime]);

	useEffect(() => {
		if (!isStarted) return;

		const interval = setInterval(() => {
			setSeconds(calcSeconds(currentState.startTime));
		}, 1000);

		return () => clearInterval(interval);
	}, [isStarted, currentState?.startTime]);

	useEffect(() => {
		if (justLoggedIn) {
			setJustLoggedIn(false);
			getDailySolves.mutate(undefined, {
				onSuccess: (data) => {
					for (const solve of data.solves) {
						const startTime = new Date(solve.started_at).getTime();
						const endTime = startTime + solve.duration * 1000;
						loadSolve(size, {
							startTime: startTime,
							endTime: endTime,
						});
					}
				},
				onSettled: (_, error) => {
					if (error) {
						removeGame(size);
					}
				},
			});
		}
	}, [justLoggedIn, getDailySolves, loadSolve, removeGame, size, setJustLoggedIn]);

	const handleSudokuStart = () => {
		const validSizes = [4, 6, 9];
		if (validSizes.includes(size)) {
			loadingGame(size);

			dailySudokuMutation.mutate(BoardSizeToString(size), {
				onSuccess: (data) => {
					const mapped = mapSudokuFromResponse(data);

					if (data) {
						setPuzzle(size, {
							board: mapped.values,
							fixed: mapped.fixed,
							session_token: mapped.session_token
						});
					}
				},
				onSettled: (_, error) => {
					if (error) {
						removeGame(size);
					}
				},
			});
		}
	}

	const { hours, minutes, remainingSeconds } = useMemo(() => SecondsToClock(seconds), [seconds]);

		return (
		<section className="play">
			<nav className='puzzle-size'>
				<NavLink to="/">
					{(state && state[4] && state[4].status === Status.FINISHED) && <Crown className='icon-crown' />}
					4x4
				</NavLink>
				<NavLink to="/play/medium">
					{(state && state[6] && state[6].status === Status.FINISHED) && <Crown className='icon-crown' />}
					6x6
				</NavLink>
				<NavLink to="/play/hard">
					{(state && state[9] && state[9].status === Status.FINISHED) && <Crown className='icon-crown' />}
					9x9
				</NavLink>
			</nav>

			{isLoading && (
				<div className='game'>
					<hr />
					<SkeletonBoard size={size} />
				</div>
			)}

			{!isStarted && !isLoading && (<div className='welcome-message'>
				<hr />

				{isFinished && (
					<div className="victory">
						<div className="title">Great Job!</div>
						<div className="subtitle">You finished in {hours != 0 && zeroPad(hours) + "h"} {zeroPad(minutes)}m {zeroPad(remainingSeconds)}s</div>
					</div>
				)}

				{!isFinished && (
					<div className='start'>
						<Button text="Start" onClick={handleSudokuStart} />
					</div>	
				)}
			</div>)}

			{isStarted && (
				<div className='game'>
					<hr />

					<div className='timer'>
						<div className='clock'>
							{hours != 0 && (<div className="part hour">
								<span className="value">{zeroPad(hours)}</span>
								<span className="label">h</span>
							</div>)}
							<div className="part minute">
								<span className="value">{minutes}</span>
								<span className="label">min</span>
							</div>
							<div className="part seconds">
								<span className="value">{remainingSeconds}</span>
								<span className="label">sec</span>
							</div>
						</div>

						<Timer className='clock-icon' />
					</div>

					<hr />

					<Board size={size} />
				</div>
			)}
		</section>
	)
}