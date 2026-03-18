import Button from "@/components/form/button/Button";
import { InputField } from "@/components/form/input/InputField";
import Logo from "@/components/layout/logo/Logo";
import "./Login.scss"
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAlertStore } from "@/store/useAlertStore";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

interface formValidation {
	valid: boolean;
	email?: string;
	password?: string;
	username?: string;
}

function isFormValid(email: string, password: string, username?: string): formValidation {
	if (username && username.length < 8) {
		return { username: "Username must be at least 8 characters long", valid: false };
	}

	if (email.length < 8) {
		return { email: "Email must be at least 8 characters long", valid: false };
	} else if (!email.includes("@")) {
		return { email: "Email must include @", valid: false };
	}

	if (password.length < 8) {
		return { password: "Password must be at least 8 characters long", valid: false };
	} else if (password.length > 32) {
		return { password: "Password must be less than 32 characters long", valid: false };
	}

	return { valid: true };
}

export default function Login() {
	const [ isLogin, setIsLogin ] = useState<boolean>(true);
	const title = isLogin ? "Login" : "Register";
	const buttonText = isLogin ? "Access" : "Register";
	const { login, register } = useAuth();
	const navigate = useNavigate();

	const authState = useAuthStore(s => s.state);

	useEffect(() => {
		if (authState?.username) {
		navigate("/", { replace: true });
		}
	}, [authState?.username, navigate]);

	const [ username, setUsername ] = useState<string>("");
	const [ email, setEmail ] = useState<string>("");
	const [ password, setPassword ] = useState<string>("");

	const pushAlert = useAlertStore(s => s.pushAlert);

	const emailRef = useRef<HTMLInputElement>(null);

	const toggleAuthMode = () => {
		setUsername("");
		setEmail("");
		setPassword("");
		setIsLogin(!isLogin);
		setTimeout(() => emailRef.current?.focus(), 0);
	};

	const handleFormSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
		e.preventDefault();

		const result = isFormValid(email, password, username);
		if (!result.valid) return pushAlert(result.email || result.password || result.username || "Something went wrong", "error");

		if (isLogin) {
			login({ email, password }, () => navigate("/"));
		} else {
			register({ username, email, password }, toggleAuthMode);
		}
	};

	return (
		<div className="enter-container">
			<Logo />

			<section className="login panel">
				<h2>{title}</h2>

				<form action="" onSubmit={handleFormSubmit} key={isLogin ? "login" : "register"} >
					<InputField
						id="email"
						label="Email"
						type="email"
						value={email}
						ref={emailRef}
						placeholder="Enter your email"
						disabled={false}
						required={true}
						onChange={(e) => setEmail(e.target.value)} />
					{!isLogin && (
						<InputField 
							id="username" 
							label="Username" 
							type="text" 
							value={username} 
							placeholder="Enter your username" 
							disabled={false} 
							required={true} 
							onChange={(e) => setUsername(e.target.value)} />
					)}
					<InputField 
						id="password" 
						label="Password" 
						type="password" 
						value={password} 
						placeholder="Enter your password" 
						disabled={false} 
						required={true} 
						onChange={(e) => setPassword(e.target.value)} />

					<Button 
						text={buttonText} 
						className="right" 
						onClick={() => {}} disabled={false} />
				</form>

				{isLogin ? (
					<p className="change-form-link">Don't have an account? <a onClick={toggleAuthMode}>Register</a></p>
				):(
					<p className="change-form-link">Have an account? <a onClick={toggleAuthMode}>Login</a></p>
				)}
			</section>

			<footer className="enter-footer">
				<p>© Copyright 2026. All rights reserved.</p>
			</footer>
		</div>
	)
}