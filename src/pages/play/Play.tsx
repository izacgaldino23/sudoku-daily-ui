import { Timer } from 'lucide-react'
import './Play.scss'
import Board from '@/components/board/Board'
import type { PlayAttributes } from '@/types/PlayTypes'
import { useEffect, useState } from 'react';

function zeroPad(num: number) {
	return String(num).padStart(2, '0');
}

export default function Play({ size }: PlayAttributes) {
	const [ seconds, setSeconds ] = useState(55);

	useEffect(() => {
		const interval = setInterval(() => {
			setSeconds(seconds => seconds + 1);
		}, 1000);
		return () => clearInterval(interval);
	}, []);
	return (
		<section className="play">
			<div className='timer'>
				<div className='clock'>
					<div className="part minute">
						<span className="value">{Math.floor(seconds / 60)}</span>
						<span className="label">min</span>
					</div>
					<div className="part seconds">
						<span className="value">{zeroPad(seconds % 60)}</span>
						<span className="label">sec</span>
					</div>
				</div>

				<Timer />
			</div>

			<Board key={size} size={size} />
		</section>
	)
}