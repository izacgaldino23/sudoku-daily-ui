import { NavLink } from "react-router-dom"
import "./Logo.scss"

export default function Logo() {
	return (
		<NavLink className="logo" to="/">
			<div className="sector">
				<span className="square filled">D</span>
				<span className="square"></span>
				<span className="square"></span>
				<span className="square filled">S</span>
			</div>

			<h2 className="title">Daily Sudoku</h2>
		</NavLink>
	)
}