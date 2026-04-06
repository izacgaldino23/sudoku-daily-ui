import { Timer } from 'lucide-react'
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
import { useDailySudoku } from '@/hooks/sudoku/mutations';

function calcSeconds(startTime?: number) {
	if (!startTime) return 0;
	return (Date.now() - startTime) / 1000
}

function zeroPad(num: number) {
	return String(num).padStart(2, '0');
}

export default function Play({ size }: PlayAttributes) {
	const state = useGameStore(s => s.state);
	const mutation = useDailySudoku();

	const setPuzzle = useGameStore(state => state.setPuzzle);
	const loadingGame = useGameStore(state => state.loadingGame);
	const removeGame = useGameStore(state => state.removeGame);

	const currentState = state[size];

	const isStarted = currentState && currentState.status == Status.PLAYING;
	const isFinished = currentState && currentState.status == Status.FINISHED;
	
	const [ seconds, setSeconds ] = useState(calcSeconds(currentState?.startTime));

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

	const handleSudokuStart = () => {
		const validSizes = [4, 6, 9];
		if (validSizes.includes(size)) {
			loadingGame(size);

			mutation.mutate(BoardSizeToString(size), {
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
				onSettled: () => {
					removeGame(size);
				},
			});
		}
	}

	const { hours, minutes, remainingSeconds } = useMemo(() => SecondsToClock(seconds), [seconds]);

	return (
		<section className="play">
			{!isStarted && (<div className='welcome-message'>
				{!isFinished && <h2>{size}x{size} Not solved yet</h2>}

				{isFinished && (
					<div className="victory">
						<div className="title">Great Job!</div>
						<div className="subtitle">You finished in {hours != 0 && zeroPad(hours)+":"}{zeroPad(minutes)}:{remainingSeconds}</div>
					</div>
				)}

				{!isFinished && <Button text={currentState?.status === Status.LOADING ? "Loading..." : "Start"} onClick={handleSudokuStart} disabled={currentState?.status === Status.LOADING} />}
			</div>)}

			{isStarted && (
				<div className='game'>
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

						<Timer />
					</div>

					<Board size={size}/>
				</div>
			)}
		</section>
	)
}