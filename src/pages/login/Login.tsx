import Button from "@/components/form/button/Button";
import { InputField } from "@/components/form/input/InputField";
import Logo from "@/components/layout/logo/Logo";
import "./Login.scss"
import { useEffect, useState } from "react";

function updateValue(value: string, setValue: (value: string) => void) {
	setValue(value);
}

export default function Login() {
	const [ isLogin, setIsLogin ] = useState<boolean>(true);
	const title = isLogin ? "Login" : "Register";

	const [ username, setUsername ] = useState<string>("");
	const [ email, setEmail ] = useState<string>("");
	const [ password, setPassword ] = useState<string>("");

	useEffect(() => {
		setEmail("");
		setPassword("");
		setUsername
	}, [isLogin]);

	return (
		<div className="enter-container">
			<Logo />

			<section className="login panel">
				<h2>{title}</h2>

				<form action="">
					{!isLogin && <InputField id="username" label="Username" type="text" placeholder="Enter your username" disabled={false} required={true} onChange={(e) => updateValue(e.target.value, setUsername)} />}
					<InputField id="email" label="Email" type="email" placeholder="Enter your email" disabled={false} required={true} onChange={(e) => updateValue(e.target.value, setEmail)} />
					<InputField id="password" label="Password" type="password" placeholder="Enter your password" disabled={false} required={true} onChange={(e) => updateValue(e.target.value, setPassword)} />

					<Button text="Access" className="right" onClick={() => {}} disabled={false} />
				</form>

				{isLogin ? (
					<p className="change-form-link">Don't have an account? <a onClick={() => setIsLogin(false)}>Register</a></p>
				):(
					<p className="change-form-link">Have an account? <a onClick={() => setIsLogin(true)}>Login</a></p>
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