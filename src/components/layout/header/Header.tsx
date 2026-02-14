import { NavLink } from "react-router-dom";
import "./Header.scss"
import Logo from "@/components/layout/logo/Logo";

export default function Header() {
	return (
		<header className="header">
			<Logo />

			<nav>
				<NavLink to="/">4x4</NavLink>
				<NavLink to="/six">6x6</NavLink>
				<NavLink to="/nine">9x9</NavLink>
			</nav>
		</header>
	)
}