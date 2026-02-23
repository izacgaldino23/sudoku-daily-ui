import { Timer } from 'lucide-react'
import './Play.scss'
import Board from '@/components/board/Board'
import { useEffect, useMemo } from 'react';
import { useGame } from '@/context/useGame';
import type { PlayAttributes } from '@/types/PlayTypes';
import Button from '@/components/button/Button';

function zeroPad(num: number) {
	return String(num).padStart(2, '0');
}

const boards: { [key: number]: { [key: string]: number } } = {
	4: randomGenerate(4),
	6: randomGenerate(6),
	9: randomGenerate(9),
}

function randomGenerate(size: number): { [key: string]: number } {
	const temp: { [key: string]: number } = {};

	const total = size * size;
	const percentage = 0.3;
	let count = Math.floor(total * percentage);

	while (count > 0) {
		const x = Math.floor(Math.random() * size) + 1;
		const y = Math.floor(Math.random() * size) + 1;
		const index = `${x}.${y}`;
		
		if (!(index in temp)) {
			temp[index] = Math.floor(Math.random() * size) + 1;
			count--;
		}
	}

	return temp
}

function generateTiles(size: number) {
	const values: number[][] = [];
	const fixed: boolean[][] = [];


	for (let row = 0; row < size; row++) {
		values[row] = [];
		fixed[row] = [];

		for (let col = 0; col < size; col++) {
			const index = `${col}.${row}`;

			if (index in boards[size]) {
				values[row][col] = boards[size][index];
				fixed[row][col] = true;
			} else {
				values[row][col] = 0;
				fixed[row][col] = false;
			}
		}
	}

	return {
		values,
		fixed
	}
}

export default function Play({ size }: PlayAttributes) {
	const { state, dispatch } = useGame();
	const currentState = state[size];

	const isStarted = currentState && currentState.board.length > 0;

	const { values, fixed } = useMemo(() => generateTiles(size), [size])

	useEffect(() => {
		if (!isStarted) return;

		const interval = setInterval(() => {
			dispatch({ type: "TICK", size });
		}, 1000);

		return () => clearInterval(interval);
	}, [isStarted, dispatch, size]);

	const handleSudokuStart = () => {
		const validSizes = [4, 6, 9];
		if (validSizes.includes(size)) {
			dispatch({ type: "START_GAME", size, payload: { board: values, fixed } })
		}
	}

	return (
		<section className="play">
			{!isStarted && <div className='welcome-message'>
				<h2>{size}x{size} Not solved yet</h2>

				<Button text='Start' onClick={handleSudokuStart} />
			</div>}

			{isStarted && <div>
				<div className='timer'>
					<div className='clock'>
						<div className="part minute">
							<span className="value">{Math.floor(currentState.seconds / 60)}</span>
							<span className="label">min</span>
						</div>
						<div className="part state.seconds">
							<span className="value">{zeroPad(currentState.seconds % 60)}</span>
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