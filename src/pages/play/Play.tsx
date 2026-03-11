import { Timer } from 'lucide-react'
import './Play.scss'
import Board from '@/components/game/board/Board'
import { useEffect, useState } from 'react';
import { useGame } from '@/context/useGame';
import type { PlayAttributes } from '@/types/PlayTypes';
import Button from '@/components/inputs/button/Button';
import { useSudoku } from '@/hooks/useSudoku';
import { Status } from '@/types/GameTypes';

function zeroPad(num: number) {
	return String(num).padStart(2, '0');
}

function calcSeconds(startTime?: number) {
	if (!startTime) return 0;
	return (Date.now() - startTime) / 1000
}

export default function Play({ size }: PlayAttributes) {
	const { state } = useGame();
	const { loading, loadGame } = useSudoku();

	const currentState = state[size];

	const isStarted = currentState && currentState.status == Status.PLAYING;
	
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

	return (
		<section className="play">
			{!isStarted && <div className='welcome-message'>
				<h2>{size}x{size} Not solved yet</h2>

				<Button text='Start' onClick={handleSudokuStart} disabled={loading} />
			</div>}

			{isStarted && <div>
				<div className='timer'>
					<div className='clock'>
						<div className="part minute">
							<span className="value">{Math.floor(seconds / 60)}</span>
							<span className="label">min</span>
						</div>
						<div className="part state.seconds">
							<span className="value">{zeroPad(Math.floor(seconds % 60))}</span>
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