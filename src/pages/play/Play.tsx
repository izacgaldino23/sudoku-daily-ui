import { Timer } from 'lucide-react'
import './Play.scss'
import Board from '@/components/game/board/Board'
import { useEffect, useMemo, useState } from 'react';
import type { PlayAttributes } from '@/types/PlayTypes';
import Button from '@/components/inputs/button/Button';
import { useSudoku } from '@/hooks/useSudoku';
import { Status } from '@/types/GameTypes';
import { useGameStore } from '@/store/useGameStore';
import { SecondsToClock } from '@/utils/gameLogic';

function calcSeconds(startTime?: number) {
	if (!startTime) return 0;
	return (Date.now() - startTime) / 1000
}

export default function Play({ size }: PlayAttributes) {
	const state = useGameStore(s => s.state);
	const { loading, loadGame } = useSudoku();

	const currentState = state[size];

	const isStarted = currentState && currentState.status == Status.PLAYING;
	const isFinished = currentState && currentState.status == Status.FINISHED;
	
	const [ seconds, setSeconds ] = useState(calcSeconds(currentState?.startTime));

	useEffect(() => {
		if (!isStarted) return;

		const interval = setInterval(() => {
			setSeconds(calcSeconds(currentState.startTime));
		}, 1000);

		return () => clearInterval(interval);
	}, [isStarted, currentState]);

	const handleSudokuStart = () => {
		const validSizes = [4, 6, 9];
		if (validSizes.includes(size)) {
			loadGame(size);
		}
	}

	const { hours, minutes, remainingSeconds } = useMemo(() => SecondsToClock(seconds), [seconds]);

	return (
		<section className="play">
			{!isStarted && <div className='welcome-message'>
				{!isFinished && <h2>{size}x{size} Not solved yet</h2>}

				{/* {isFinished && <h2>{size}x{size} Finished in {zeroPad(Math.floor(seconds / 60))}:{zeroPad(Math.floor(seconds % 60))}</h2>} */}
				{isFinished && (
					<div className="victory">
						<div className="title">Great Job!</div>
						<div className="subtitle">You finished in {hours}:{minutes}:{remainingSeconds}</div>
					</div>
				)}

				{!isFinished && <Button text={loading ? "Loading..." : "Start"} onClick={handleSudokuStart} disabled={loading} />}
			</div>}

			{isStarted && <div>
				<div className='timer'>
					<div className='clock'>
						{hours != "00" && (<div className="part hour">
							<span className="value">{hours}</span>
							<span className="label">h</span>
						</div>)}
						<div className="part minute">
							<span className="value">{minutes}</span>
							<span className="label">min</span>
						</div>
						<div className="part state.seconds">
							<span className="value">{remainingSeconds}</span>
							<span className="label">sec</span>
						</div>
					</div>

					<Timer />
				</div>

				<Board size={size}/>
			</div>}
		</section>
	)
}