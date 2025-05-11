import React, { useState } from "react";
import "../../styles/Public/Login.css";
import Navbar from "../../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../store/Users";
import CONFIG from "../../data/config";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [transition, setTransition] = useState(false);
	const [loginError, setLoginError] = useState("");

	const validate = () => {
		const validationErrors = {};
		if (!email.trim()) {
			validationErrors.email = "Email is required";
		}
		if (!password.trim()) {
			validationErrors.password = "Password is required";
		}
		setErrors(validationErrors);
		return Object.keys(validationErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validate()) {
			setLoading(true);
			axios
				.post(`${CONFIG.BASE_URL}/login`, { email, password })
				.then((res) => {
					if (res.data.message) {
						setLoginError(res.data.message);
						setLoading(false);
					} else {
						dispatch(login({ token: res.data.token, user: res.data.userData }));
						setTransition(true);
						setTimeout(() => {
							navigate("/pets");
						}, 1500);
					}
				});
		}
	};

	if (transition) {
		return (
			<div
				className="loading-screen"
				style={{
					backgroundColor: "#f2e6d6",
					height: "100vh",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "1rem",
					}}
				>
					<div
						className="logo"
						style={{ display: "flex", alignItems: "center" }}
					>
						<img
							src="https://res.cloudinary.com/dmquudoki/image/upload/v1716127273/FurrMe_Logo_sba9mx.png"
							alt="FurrMe Logo"
							style={{ height: "60px", width: "60px" }}
						/>
					</div>
					<h1
						style={{
							fontSize: "3rem",
							fontWeight: "bold",
							color: "#333",
							fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
						}}
					>
						FurrMe
					</h1>
				</div>
			</div>
		);
	}

	return (
		<>
			<div>
				<Navbar />
				<div className="page-container">
					<div className="bg-container"></div>
					<div className="login-form">
						<h1 className="login-header">Login</h1>
						<div className="tagline-container">
							<p className="tagline">
								Homeless to Loved: Adopting Joy, One Paw at a Time
							</p>
						</div>
						<form onSubmit={handleSubmit} className="login-form">
							<div className="input-container">
								<div className="inputs email">
									<input
										id="email"
										name="email"
										type="email"
										className="tbxEmail"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										placeholder="Email"
									/>
									<h3 className="login-error">
										{errors.email && <span> {errors.email} </span>}
									</h3>
								</div>
								<div className="inputs password">
									<input
										name="password"
										id="password"
										type="password"
										className="tbxPassword"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="Password"
									/>
									<h4 className="login-error">
										{errors.password && <span>{errors.password}</span>}
										{!errors.password && loginError && password && (
											<span>{loginError}</span>
										)}
									</h4>
								</div>

								<Link to="/forgot" className="forgotPassword">
									Forgot Password
								</Link>
							</div>
							<div className="button-container">
								<button
									type="submit"
									className={`login-button ${loading ? "loading" : ""}`}
								>
									{loading ? "Logging in..." : "Login"}
								</button>
							</div>
						</form>
						<div className="login-footer">
							<p>
								Don't have an account?{" "}
								<Link to="/register" className="lblCreateAccount">
									Create an Account
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Login;
