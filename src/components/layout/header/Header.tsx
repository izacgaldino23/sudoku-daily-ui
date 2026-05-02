import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "./Header.scss"
import Logo from "@/components/layout/logo/Logo";
import { useAuthStore } from "@/store/useAuthStore";
import { User, Menu, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
	const location = useLocation();
	const navigate = useNavigate();
	const isPlayActive = location.pathname === "/" || location.pathname.startsWith("/play");
	const authState = useAuthStore(s => s.state);
	const logout = useAuthStore(s => s.logout);
	const [showDropdown, setShowDropdown] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const mobileNavRef = useRef<HTMLDivElement>(null);

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
			<button
				className="hamburger"
				onClick={() => setMobileMenuOpen(true)}
				aria-label="Open navigation menu"
			>
				<Menu />
			</button>

			<Logo />

			<nav>
				<NavLink to="/" className={() => isPlayActive ? "active" : ""}>Play</NavLink>
				<NavLink to="/leaderboard">Leaderboard</NavLink>
				<NavLink to="/about">About</NavLink>
			</nav>

			{mobileMenuOpen && (
				<div className="mobile-nav-overlay" ref={mobileNavRef} onClick={() => setMobileMenuOpen(false)}>
					<div className="mobile-nav-content" onClick={(e) => e.stopPropagation()}>
						<button
							className="mobile-nav-close"
							onClick={() => setMobileMenuOpen(false)}
							aria-label="Close navigation menu"
						>
							<X />
						</button>
						<nav className="mobile-nav-links">
							<NavLink to="/" onClick={() => setMobileMenuOpen(false)} className={() => isPlayActive ? "active" : ""}>
								Play
							</NavLink>
							<NavLink to="/leaderboard" onClick={() => setMobileMenuOpen(false)}>
								Leaderboard
							</NavLink>
							<NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>
								About
							</NavLink>
						</nav>
					</div>
				</div>
			)}

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
								<NavLink to="/profile" onClick={() => {
									setShowDropdown(false);
									setMobileMenuOpen(false);
								}}>
									Profile
								</NavLink>
							</li>
							<li>
								<button onClick={() => {
									handleLogout();
									setMobileMenuOpen(false);
								}}>Logout</button>
							</li>
						</ul>
					)}
				</div>
			) : (
				<NavLink to="/login" className="profile-link" onClick={() => setMobileMenuOpen(false)}>
					<User className="profile-icon"/>
				</NavLink>
			)}
		</header>
	)
}