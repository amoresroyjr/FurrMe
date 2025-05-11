import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import "../../styles/Public/Register.css";
import { Link } from "react-router-dom";
import axios from "axios";
import RedirectModal from "../../components/RedirectModal";

import Icon from "react-icons-kit";
import { basic_eye } from "react-icons-kit/linea/basic_eye";
import { basic_eye_closed } from "react-icons-kit/linea/basic_eye_closed";
import { arrows_exclamation } from "react-icons-kit/linea/arrows_exclamation";
import { arrows_circle_check } from "react-icons-kit/linea/arrows_circle_check";
import { androidAlert } from "react-icons-kit/ionicons/androidAlert";
import { checkmarkCircled } from "react-icons-kit/ionicons/checkmarkCircled";
import CONFIG from "../../data/config";

function Register() {
	const [formData, setformData] = useState({
		fname: "",
		lname: "",
		email: "",
		cpass: "",
		image:
			"https://res.cloudinary.com/dmquudoki/image/upload/v1716289449/fmzaxpxgzginvhs4ljcn.jpg", //default image for new accounts
		role: "User",
	});
	const [errors, setErrors] = useState({});
	const [password, setPassword] = useState("");
	const [emailList, setEmailList] = useState([]);
	const [link, setLink] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContents, setmodalContents] = useState({
		title: "",
		contents: "",
	});
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (formData.email) {
			axios
				.post(`${CONFIG.BASE_URL}/emailValidate`, formData.email)
				.then((res) => {
					setEmailList(res.data);
				})
				.catch((error) => {
					console.error(error);
				});
		}
	}, [formData.email]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setformData((prevState) => ({ ...prevState, [name]: value }));
	};

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	function password_validate(password) {
		var re = {
			upper: /(?=.*[A-Z])/,
			lower: /(?=.*[a-z])/,
			specialChar: /[ -/:-@[-`{-~]/,
			digit: /(?=.*[0-9])/,
		};
		return (
			re.upper.test(password) &&
			re.lower.test(password) &&
			re.specialChar.test(password) &&
			re.digit.test(password)
		);
	}

	function email_validate(email) {
		var re = {
			check: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
			lower: /(?=.*[a-z])/,
		};
		const emails = emailList.map((user) => user.email);
		if (emails.includes(email)) return 2;
		if (re.check.test(email) && re.lower.test(email)) return 1;
		return 0;
	}

	const validateForm = () => {
		let validationErrors = {};
		if (!formData.fname.trim()) {
			validationErrors.fname = "First Name is required";
		}
		if (!formData.lname.trim()) {
			validationErrors.lname = "Last Name is required";
		}
		if (!formData.email.trim()) {
			validationErrors.email = "Email is required";
		}
		if (!password_validate(password)) {
			validationErrors.password =
				"Must contain one upper, lower case, a symbol and a number";
		}
		if (password.length > 30) {
			validationErrors.password = "Password too long";
		}
		if (password.length < 8 && password.length > 0) {
			validationErrors.password =
				"Password too short should be at least 8 characters";
		}
		if (password.length === 0) {
			validationErrors.password = "Password is required";
		}
		if (password !== formData.cpass) {
			validationErrors.cpass = "Password is dont match";
		}
		setErrors(validationErrors);
		return Object.keys(validationErrors).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			setLoading(true); // Set loading to true when the registration starts

			axios
				.post(`${CONFIG.BASE_URL}/register`, { formData, password })
				.then((res) => {
					if (res.data.message !== "Success") {
						setmodalContents({
							title: "Register Unsuccessful",
							contents: res.data.message,
						});
						setIsModalOpen(!isModalOpen);
					} else {
						setmodalContents({
							title: "Register Successful",
							contents: "Redirecting to Login Page",
						});
						setIsModalOpen(!isModalOpen);
						setLink("/login");
					}
				})
				.catch((error) => {
					console.error(error);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};

	const [type, setType] = useState("password");

	// validated states
	const [lowerValidated, setLowerValidated] = useState(false);
	const [upperValidated, setUpperValidated] = useState(false);
	const [numberValidated, setNumberValidated] = useState(false);
	const [specialValidated, setSpecialValidated] = useState(false);
	const [lengthValidated, setLengthValidated] = useState(false);

	const handleChange = (value) => {
		setPassword(value);
		const lower = new RegExp("(?=.*[a-z])");
		const upper = new RegExp("(?=.*[A-Z])");
		const number = new RegExp("(?=.*[0-9])");
		const special = new RegExp("(?=.*[!@#$%^&*])");
		const length = new RegExp("(?=.{8,})");
		if (lower.test(value)) {
			setLowerValidated(true);
		} else {
			setLowerValidated(false);
		}
		if (upper.test(value)) {
			setUpperValidated(true);
		} else {
			setUpperValidated(false);
		}
		if (number.test(value)) {
			setNumberValidated(true);
		} else {
			setNumberValidated(false);
		}
		if (special.test(value)) {
			setSpecialValidated(true);
		} else {
			setSpecialValidated(false);
		}
		if (length.test(value)) {
			setLengthValidated(true);
		} else {
			setLengthValidated(false);
		}
	};

	return (
		<div>
			{link === "" ? (
				""
			) : (
				<RedirectModal
					isOpen={true}
					onClose={toggleModal}
					title={modalContents.title}
					link={link}
				>
					<p>{modalContents.contents}</p>
				</RedirectModal>
			)}
			<Navbar />
			<div className="signup-page-container">
				<div className="signupbg"></div>
				<div className="signup-form">
					<div className="signup-header">
						<h1>Register</h1>
						<p>
							Join us in making a difference by opening your heart and home to a
							pet in need today. Together, we can create countless tail-wagging
							and purr-filled moments of joy!
						</p>
					</div>
					<div className="signup-inputs-container">
						<form className="signup-inputs-form" onSubmit={handleSubmit}>
							<input
								id="firstname"
								type="text"
								name="fname"
								className="signup-firstname"
								placeholder="First Name"
								onChange={handleInputChange}
							/>
							<input
								id="lastname"
								type="text"
								name="lname"
								className="signup-firstname"
								placeholder="Last Name"
								onChange={handleInputChange}
							/>
							<input
								type="email"
								name="email"
								placeholder="Email"
								value={formData.email}
								onChange={handleInputChange}
							/>
							<input
								id="password"
								type={type}
								className="signup-password"
								placeholder="Password"
								name="password"
								onChange={(e) => handleChange(e.target.value)}
							/>
							{type === "password" ? (
								<span className="icon-span" onClick={() => setType("text")}>
									<Icon icon={basic_eye_closed} size={18} />
								</span>
							) : (
								<span className="icon-span" onClick={() => setType("password")}>
									<Icon icon={basic_eye} size={18} />
								</span>
							)}
							<input
								id="cnfrm-password"
								type="password"
								name="cpass"
								className="signup-cnfrmPassword"
								placeholder="Confirm Password"
								onChange={handleInputChange}
							/>
							<button
								type="submit"
								disabled={loading}
								className="btn-createAccnt"
							>
								{loading ? "Creating Account..." : "Create Account"}
							</button>
						</form>
						<div className="signup-inputs-warning">
							<div class="button-item">
								{errors.fname ? (
									<div>
										<button className="fname-icon">
											{formData.fname.length === 0 ? (
												<Icon
													icon={androidAlert}
													size={18}
													style={{
														color: "red",
													}}
												/>
											) : (
												<Icon
													icon={checkmarkCircled}
													size={18}
													style={{
														color: "green",
													}}
												/>
											)}
										</button>
										{formData.fname.length === 0 ? (
											<div class="popup-content">First Name is required</div>
										) : null}
									</div>
								) : (
									<button className="fname-hidden"></button>
								)}
							</div>
							<div class="button-item">
								{errors.lname ? (
									<div>
										<button className="lname-icon">
											{formData.lname.length === 0 ? (
												<Icon
													icon={androidAlert}
													size={18}
													style={{
														color: "red",
													}}
												/>
											) : (
												<Icon
													icon={checkmarkCircled}
													size={18}
													style={{
														color: "green",
													}}
												/>
											)}
										</button>
										{formData.lname.length === 0 ? (
											<div class="popup-content">Last Name is required</div>
										) : null}
									</div>
								) : (
									<button className="lname-hidden"></button>
								)}
							</div>
							<div class="button-item">
								{formData.email.length !== 0 || errors.email ? (
									<div>
										<button className="email-icon">
											{email_validate(formData.email) === 1 ? (
												<Icon
													icon={checkmarkCircled}
													size={18}
													style={{ color: "green" }}
												/>
											) : (
												<Icon
													icon={androidAlert}
													size={18}
													style={{ color: "red" }}
												/>
											)}
										</button>
										{email_validate(formData.email) === 2 && (
											<div class="popup-content">Email already taken!</div>
										)}
										{email_validate(formData.email) === 0 && (
											<div class="popup-content">Invalid Email Format!</div>
										)}
										{formData.email.length === 0 && (
											<div class="popup-content">Password Required</div>
										)}
									</div>
								) : (
									<button className="lname-hidden"></button>
								)}
							</div>
							<div class="button-item">
								{errors.password || password.length !== 0 ? (
									<div>
										<button className="pass-icon">
											{password_validate(password) ? (
												<Icon
													icon={checkmarkCircled}
													size={18}
													style={{ color: "green" }}
												/>
											) : (
												<Icon
													icon={androidAlert}
													size={18}
													style={{ color: "red" }}
												/>
											)}
										</button>
										{!password_validate(password) ? (
											<main className="popup-content">
												<div
													className={
														lowerValidated ? "validated" : "not-validated"
													}
												>
													{lowerValidated ? (
														<span className="list-icon green">
															<Icon icon={arrows_circle_check} />
														</span>
													) : (
														<span className="list-icon">
															<Icon icon={arrows_exclamation} />
														</span>
													)}
													one lowercase letter
												</div>
												<div
													className={
														upperValidated ? "validated" : "not-validated"
													}
												>
													{upperValidated ? (
														<span className="list-icon green">
															<Icon icon={arrows_circle_check} />
														</span>
													) : (
														<span className="list-icon">
															<Icon icon={arrows_exclamation} />
														</span>
													)}
													one uppercase letter
												</div>
												<div
													className={
														numberValidated ? "validated" : "not-validated"
													}
												>
													{numberValidated ? (
														<span className="list-icon green">
															<Icon icon={arrows_circle_check} />
														</span>
													) : (
														<span className="list-icon">
															<Icon icon={arrows_exclamation} />
														</span>
													)}
													one number
												</div>
												<div
													className={
														specialValidated ? "validated" : "not-validated"
													}
												>
													{specialValidated ? (
														<span className="list-icon green">
															<Icon icon={arrows_circle_check} />
														</span>
													) : (
														<span className="list-icon">
															<Icon icon={arrows_exclamation} />
														</span>
													)}
													one special character
												</div>
												<div
													className={
														lengthValidated ? "validated" : "not-validated"
													}
												>
													{lengthValidated ? (
														<span className="list-icon green">
															<Icon icon={arrows_circle_check} />
														</span>
													) : (
														<span className="list-icon">
															<Icon icon={arrows_exclamation} />
														</span>
													)}
													8 characters
												</div>
											</main>
										) : null}
									</div>
								) : (
									<button className="lname-hidden"></button>
								)}
							</div>
							<div class="button-item">
								{errors.cpass ? (
									<div>
										<button className="fname-icon">
											{formData.cpass.length === 0 ||
											formData.cpass !== password ? (
												<Icon
													icon={androidAlert}
													size={18}
													style={{
														color: "red",
													}}
												/>
											) : (
												<Icon
													icon={checkmarkCircled}
													size={18}
													style={{
														color: "green",
													}}
												/>
											)}
										</button>
										{formData.cpass.length === 0 ||
										formData.cpass !== password ? (
											<div class="popup-content">Password don't match!</div>
										) : null}
									</div>
								) : (
									<button className="fname-hidden"></button>
								)}
							</div>
						</div>
					</div>

					<p className="terms">
						By creating an account, you agree to FurrMe's{" "}
						<Link to="/terms">Terms of Service</Link> and{" "}
						<Link to="/terms">Privacy Policy</Link>
					</p>
					<h3>
						Already have an account?{" "}
						<Link to="/login" className="footer-login">
							Login
						</Link>
					</h3>
				</div>
			</div>
		</div>
	);
}

export default Register;
