import { Crown, Timer } from 'lucide-react'
import './Play.scss'
import Board from '@/components/game/board/Board'
import { useEffect, useMemo, useState } from 'react';
import type { PlayAttributes } from '@/types/ui';
import Button from '@/components/form/button/Button';
import { Status } from '@/types/game';
import { useGameStore } from '@/store/useGameStore';
import { SecondsToClock } from '@/utils/gameLogic';
import { BoardSizeToString } from '@/utils/board';
import { mapSudokuFromResponse } from '@/utils/mappers';
import { useDailySudoku, useGetDailySolves } from '@/hooks/sudoku/mutations';
import { NavLink, useLocation } from 'react-router-dom';

function calcSeconds(startTime?: number) {
	if (!startTime) return 0;
	return (Date.now() - startTime) / 1000
}

function zeroPad(num: number) {
	return String(num).padStart(2, '0');
}

export default function Play({ size }: PlayAttributes) {
	const state = useGameStore(s => s.state);
	const dailySudokuMutation = useDailySudoku();
	const getDailySolves = useGetDailySolves();

	const setPuzzle = useGameStore(state => state.setPuzzle);
	const loadingGame = useGameStore(state => state.loadingGame);
	const removeGame = useGameStore(state => state.removeGame);
	const loadSolve = useGameStore(state => state.loadSolve);

	const currentState = state[size];

	const isStarted = currentState && currentState.status == Status.PLAYING;
	const isFinished = currentState && currentState.status == Status.FINISHED;
	
	const [ seconds, setSeconds ] = useState(calcSeconds(currentState?.startTime));

	const cameFromLogin = useLocation().state?.fromLogin;

	useEffect(() => {
		setSeconds(calcSeconds(currentState?.startTime));
	}, [currentState?.startTime]);

	useEffect(() => {
		if (!isStarted) return;

		const interval = setInterval(() => {
			setSeconds(calcSeconds(currentState.startTime));
		}, 1000);

		return () => clearInterval(interval);
	}, [isStarted, currentState?.startTime]);

	useEffect(() => {
		if (cameFromLogin) {
			getDailySolves.mutate(undefined, {
				onSuccess: (data) => {
					for (const solve of data) {
						const startTime = new Date(solve.started_at).getTime();
						loadSolve(size, {
							startTime: startTime,
							endTime: startTime + solve.duration,
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
	}, [cameFromLogin, getDailySolves, loadSolve, removeGame, size]);

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
					{ (state && state[4] && state[4].status === Status.FINISHED) && <Crown className='icon-crown' />}
					4x4
				</NavLink>
				<NavLink to="/play/medium">
					{ (state && state[6] && state[6].status === Status.FINISHED) && <Crown className='icon-crown' />}
					6x6
				</NavLink>
				<NavLink to="/play/hard">
					{ (state && state[9] && state[9].status === Status.FINISHED) && <Crown className='icon-crown' />}
					9x9
				</NavLink>
			</nav>

			{!isStarted && (<div className='welcome-message'>
				<hr />

				{isFinished && (
					<div className="victory">
						<div className="title">Great Job!</div>
						<div className="subtitle">You finished in {hours != 0 && zeroPad(hours)+"h"} {zeroPad(minutes)}m {remainingSeconds}s</div>
					</div>
				)}

				{!isFinished && (
					<div className='start'>
						<Button text={currentState?.status === Status.LOADING ? "Loading..." : "Start"} onClick={handleSudokuStart} disabled={currentState?.status === Status.LOADING} />
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

					<Board size={size}/>
				</div>
			)}
		</section>
	)
}