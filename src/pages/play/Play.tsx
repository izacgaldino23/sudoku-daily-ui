import { Timer } from 'lucide-react'
import './Play.scss'
import Board from '@/components/board/Board'

interface PlayAttributes {
	size: number
}

export default function Play({ size }: PlayAttributes) {
	return (
		<section className="play">
			<div className='timer'>
				<div className='clock'>
					<div className="part minute">
						<span className="value">0</span>
						<span className="label">min</span>
					</div>
					<div className="part seconds">
						<span className="value">0</span>
						<span className="label">sec</span>
					</div>
				</div>

				<Timer />
			</div>

			<Board key={size} size={size} />
		</section>
	)
}