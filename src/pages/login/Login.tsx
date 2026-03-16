import Button from "@/components/form/button/Button";
import { InputField } from "@/components/form/input/InputField";
import Logo from "@/components/layout/logo/Logo";
import "./Login.scss"
import { useRef, useState } from "react";

export default function Login() {
	const [ isLogin, setIsLogin ] = useState<boolean>(true);
	const title = isLogin ? "Login" : "Register";

	const [ username, setUsername ] = useState<string>("");
	const [ email, setEmail ] = useState<string>("");
	const [ password, setPassword ] = useState<string>("");

	const emailRef = useRef<HTMLInputElement>(null);

	const toggleAuthMode = () => {
		setUsername("");
		setEmail("");
		setPassword("");
		setIsLogin(!isLogin);
		setTimeout(() => emailRef.current?.focus(), 0);
	};

	return (
		<div className="enter-container">
			<Logo />

			<section className="login panel">
				<h2>{title}</h2>

				<form action="" key={isLogin ? "login" : "register"} >
					<InputField id="email" label="Email" type="email" value={email} ref={emailRef} placeholder="Enter your email" disabled={false} required={true} onChange={(e) => setEmail(e.target.value)} />
					{!isLogin && <InputField id="username" label="Username" type="text" value={username} placeholder="Enter your username" disabled={false} required={true} onChange={(e) => setUsername(e.target.value)} />}
					<InputField id="password" label="Password" type="password" value={password} placeholder="Enter your password" disabled={false} required={true} onChange={(e) => setPassword(e.target.value)} />

					<Button text="Access" className="right" onClick={() => {}} disabled={false} />
				</form>

				{isLogin ? (
					<p className="change-form-link">Don't have an account? <a onClick={toggleAuthMode}>Register</a></p>
				):(
					<p className="change-form-link">Have an account? <a onClick={toggleAuthMode}>Login</a></p>
				)}
				
			</section>
			{/* {isLogin ? (
			) : (
				<section className="register panel">
					<h2>Register</h2>

					<form action="">
						<InputField id="username" label="Username" type="email" placeholder="Enter a unique username" disabled={false} required={true} />
						<InputField id="email" label="Email" type="email" placeholder="Enter your email" disabled={false} required={true} />
						<InputField id="password" label="Password" type="password" placeholder="Enter your password" disabled={false} required={true} />

						<Button text="Login" className="right" onClick={() => {}} disabled={false} />
					</form>

					<p className="change-form-link">Have an account? <a onClick={() => setIsLogin(true)}>Login</a></p>
				</section>
			)} */}
		</div>
	)
}