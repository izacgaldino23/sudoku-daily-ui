import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Header.scss"
import Logo from "@/components/layout/logo/Logo";
import { useAuthStore } from "@/store/useAuthStore";
import { User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
	const location = useLocation();
	const navigate = useNavigate();
	const isPlayActive = location.pathname === "/" || location.pathname.startsWith("/play");
	const authState = useAuthStore(s => s.state);
	const logout = useAuthStore(s => s.logout);
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const isLoggedIn = (authState && authState.username);

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
				setShowDropdown(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleLogout = () => {
		logout();
		navigate("/");
		setShowDropdown(false);
	};

	return (
		<header className="header">
			<Logo />

			<nav>
				<NavLink to="/" className={() => isPlayActive ? "active" : ""}>Play</NavLink>
				<NavLink to="/leaderboard">Leaderboard</NavLink>
				<NavLink to="/about">About</NavLink>
			</nav>

			{isLoggedIn ? (
				<div className="profile-dropdown" ref={dropdownRef}>
					<button 
						className="profile-link" 
						onClick={() => setShowDropdown(!showDropdown)}
					>
						<h3>{authState.username}</h3>
						<User className="profile-icon"/>
					</button>
					{showDropdown && (
						<ul className="dropdown-menu">
							<li>
								<NavLink to="/profile" onClick={() => setShowDropdown(false)}>
									Profile
								</NavLink>
							</li>
							<li>
								<button onClick={handleLogout}>Logout</button>
							</li>
						</ul>
					)}
				</div>
			) : (
				<NavLink to="/login" className="profile-link">
					<User className="profile-icon"/>
				</NavLink>
			)}
		</header>
	)
}