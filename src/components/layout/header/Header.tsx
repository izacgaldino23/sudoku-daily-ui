import { NavLink, useLocation } from "react-router-dom";
import "./Header.scss"
import Logo from "@/components/layout/logo/Logo";

export default function Header() {
	const loc = useLocation();
	const isPlayActive = loc.pathname === "" || loc.pathname === "/" || loc.pathname.startsWith("/play");

	return (
		<header className="header">
			<Logo />

			{isPlayActive && (
				<nav>
					<NavLink to="/">4x4</NavLink>
					<NavLink to="/play/medium">6x6</NavLink>
					<NavLink to="/play/hard">9x9</NavLink>
				</nav>
			)}
		</header>
	)
}