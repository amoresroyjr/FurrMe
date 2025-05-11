import React, { useState, useEffect } from "react";
import "../../styles/User/Adoption.css";
import Navbar from "../../components/Navbar";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Breadcrumbs from "../../components/Breadcrumbs";
import CountDownModal from "../../components/CountdownModal";
import circleLoading from "../../assets/circleLoading.gif";
import shibaLoading from "../../assets/shibaloading.gif";
import CONFIG from "../../data/config";

function AdoptPage() {
	const [showTerms, setShowTerms] = useState(false);
	const [fileName, setFileName] = useState("No file chosen");
	const [imageAttached, setImageAttached] = useState(false);
	const [uploadedImg, setUploadedImg] = useState("");
	const petData = useLocation().state;
	const [errors, setErrors] = useState({});
	const validationErrors = {};
	const navigate = useNavigate();
	const { category, id } = useParams();
	const [formData, setformData] = useState({
		email: "",
		address: "",
		contact: "",
		household: "",
		employment: "",
		pet_exp: "",
	});
	const getData = useSelector((state) => state.value);
	const userData = getData.user;
	const token = getData.token;
	const customNames = petData
		? {
				[id]: petData.name,
			}
		: {};
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContents, setmodalContents] = useState({
		title: "",
		contents: "",
	});
	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};
	const [loading, setLoading] = useState(false);
	const [waiting, setWaiting] = useState(false);

	useEffect(() => {
		const handleClickOutside = (e) => {
			const modalContent = document.querySelector(".modal-content");
			if (isModalOpen && modalContent && !modalContent.contains(e.target)) {
				toggleModal();
			}
		};

		if (isModalOpen) {
			document.addEventListener("click", handleClickOutside);
		} else {
			document.removeEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isModalOpen]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (event.target.closest(".TAC-container") === null) {
				setShowTerms(false);
			}
		};

		document.addEventListener("click", handleClickOutside);

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, []);

	const handleInputChange = (e) => {
		e.preventDefault();
		const { name, value } = e.target;

		setErrors((prevErrors) => {
			const newErrors = { ...prevErrors };
			if (value.trim()) {
				delete newErrors[name];
			}
			return newErrors;
		});

		setformData((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!uploadedImg) {
			validationErrors.upload = "!";
		}
		if (!formData.address.trim()) {
			validationErrors.address = "!";
		}
		if (!formData.contact.trim()) {
			validationErrors.contact = "!";
		}
		if (!formData.household.trim()) {
			validationErrors.household = "!";
		}
		if (!formData.employment.trim()) {
			validationErrors.employment = "!";
		}
		if (!formData.pet_exp.trim()) {
			validationErrors.pet_exp = "!";
		}
		if (formData.household.length > 500) {
			validationErrors.household = "!";
		}
		if (formData.employment.length > 500) {
			validationErrors.employment = "!";
		}
		if (formData.pet_exp.length > 500) {
			validationErrors.pet_exp = "!";
		}
		setErrors(validationErrors);
		if (Object.keys(validationErrors).length === 0) {
			if (!uploadedImg) {
				setFileName(null);
			}
			setWaiting(true);
			try {
				const res = await axios.post(`${CONFIG.BASE_URL}/upload`, {
					image_url: uploadedImg,
				});
				await axios
					.post(
						`${CONFIG.BASE_URL}/adoptReq`,
						{
							id: petData.pet_id,
							valid_id: res.data,
							email: userData.email,
							address: formData.address,
							contact: formData.contact,
							household: formData.household,
							employment: formData.employment,
							pet_exp: formData.pet_exp,
						},
						{
							headers: {
								token: token,
							},
						}
					)
					.then((res) => {
						if (!res.data.message) {
							setmodalContents({
								title: "Request Error!",
							});
							setIsModalOpen(true);
						} else {
							setmodalContents({
								title: "Adoption Request Sent!",
								contents:
									"An email will be sent to the address you provided within 48 hours regarding the approval status. Please check your inbox (and spam/junk folder) for our message. If you have any questions in the meantime, feel free to contact us at furrme@gmail.com.",
							});
							setIsModalOpen(true);
							setformData((prevState) => ({
								...prevState,
								address: "",
								contact: "",
								household: "",
								employment: "",
								pet_exp: "",
							}));
							setFileName("No file chosen");
							setImageAttached(false);
							setUploadedImg("");
							document.getElementById("validID").value = "";
						}
						setWaiting(false);
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log(err);
			}
		}
		if (isModalOpen) {
			navigate("/pets");
		}
	};

	const toggleTerms = () => {
		setShowTerms(!showTerms);
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setUploadedImg(reader.result);
				setFileName(file.name);
				setImageAttached(true);

				setErrors((prevErrors) => {
					const newErrors = { ...prevErrors };
					delete newErrors.upload;
					return newErrors;
				});
			};
			reader.readAsDataURL(file);
		} else {
			setImageAttached(false);
			alert("Please upload a valid JPEG or PNG image.");
		}
	};

	const removeImage = () => {
		setFileName("No file chosen");
		setImageAttached(false);
		setUploadedImg("");
		document.getElementById("validID").value = "";

		setErrors((prevErrors) => ({
			...prevErrors,
			upload: "!",
		}));
	};

	useEffect(() => {
		console.log(errors);
	}, [errors]);

	return (
		<>
			{loading ? (
				<div className="loadingOverlay">
					<img src={circleLoading} alt="loading" className="loadingImage" />
					<p>Loading</p>
				</div>
			) : (
				<>
					<CountDownModal
						isOpen={isModalOpen}
						onClose={toggleModal}
						title={modalContents.title}
					>
						<p>{modalContents.contents}</p>
					</CountDownModal>
					<div>
						<Navbar />
						<div className="adoptionVerificationPage">
							<Breadcrumbs customNames={customNames} />
							<div className="adoptionVerificationContainer">
								<div className="petDetails">
									<h3>Pet for Adoption: </h3>
									<div className="petDetailsImgContainer">
										<img
											className="petDetailsImg"
											src={petData.image}
											alt={petData.name}
										/>
									</div>
									<h2 className="petName">{petData.name}</h2>
								</div>
								<div className="adoptionVerification">
									<div className="header">
										<h2>Verify Pet Adoption Application</h2>
										<p>
											Please provide the following information to verify your
											pet adoption application. This helps ensure the well-being
											of our furry friends.
										</p>
									</div>
									<div className="inputContainer">
										<p className="petNamePrev">
											Pet for Adoption: {petData.name}
										</p>
										<label htmlFor="email">Email</label>
										<input
											type="text"
											id="email"
											name="email"
											value={userData.email}
											onChange={handleInputChange}
											readonly="readonly"
										/>
										<label htmlFor="validID" className="validIDImg">
											Upload a valid ID
										</label>
										<div className="inputWarningWrapper">
											<input
												type="file"
												id="validID"
												style={{ display: "none" }}
												onChange={handleFileChange}
												accept=".jpg,.jpeg,.png"
											/>
											<div className="attachValidID">
												<button
													className="btnValidID"
													onClick={() =>
														document.getElementById("validID").click()
													}
												>
													{fileName}
												</button>
												{imageAttached && (
													<IoIosCloseCircleOutline
														className="removeID"
														onClick={removeImage}
													/>
												)}
												{errors.upload && (
													<span className="warningInside">{errors.upload}</span>
												)}
											</div>
										</div>
										<label htmlFor="address">Address</label>
										<div className="inputWarningWrapper">
											<textarea
												id="address"
												name="address"
												placeholder="Enter your address"
												value={formData.address}
												onChange={handleInputChange}
											></textarea>
											{errors.address && (
												<span className="warningInside">{errors.address}</span>
											)}
										</div>
										<label htmlFor="contactNum">Contact Number</label>
										<div className="inputWarningWrapper">
											<input
												type="number"
												id="contactNum"
												placeholder="Enter your phone number"
												name="contact"
												value={formData.contact}
												onChange={handleInputChange}
											/>
											{errors.contact && (
												<span className="warningInside">{errors.contact}</span>
											)}
										</div>
										<label htmlFor="householdInfo">Household Information</label>
										<div className="inputWarningWrapper">
											<textarea
												id="household"
												placeholder="Please describe your current residence (e.g. the people who are currently living with you, their age and related."
												className="respBox"
												value={formData.household}
												name="household"
												onChange={handleInputChange}
											></textarea>
											{errors.household && (
												<span className="warningInside">
													{errors.household}
												</span>
											)}
										</div>
										<p className="charCount">
											{formData.household.length} / 500 characters
										</p>

										<label htmlFor="employmentLifestyle">
											Employment and Lifestyle
										</label>
										<div className="inputWarningWrapper">
											<textarea
												id="employmentLifestyle"
												placeholder="Please describe your current occupation and work schedule."
												className="respBox"
												value={formData.employment}
												name="employment"
												onChange={handleInputChange}
											></textarea>
											{errors.employment && (
												<span className="warningInside">
													{errors.employment}
												</span>
											)}
										</div>
										<p className="charCount">
											{formData.employment.length} / 500 characters
										</p>

										<label htmlFor="petExp">Pet Experiences</label>
										<div className="inputWarningWrapper">
											<textarea
												id="pet_exp"
												placeholder="Please state your previous experiences having a pet if any."
												className="respBox"
												value={formData.pet_exp}
												name="pet_exp"
												onChange={handleInputChange}
											></textarea>
											{errors.pet_exp && (
												<span className="warningInside">{errors.pet_exp}</span>
											)}
										</div>
										<p className="charCount">
											{formData.pet_exp.length} / 500 characters
										</p>
										<p className="respDisclaimer">
											The way your responses are asked are in a way that allows
											you to describe your situation and intentions in your own
											words while being comfortable on what to disclose and
											whatnot but please do note that this will be the primary
											reference on the approval of your adoption application.
										</p>
									</div>
									<div className="TAC-container">
										<p className="TAC-header" onClick={toggleTerms}>
											Terms and Conditions for Pet Adoption
											{showTerms ? <FaChevronUp /> : <FaChevronDown />}
										</p>
										<div
											class="termsAndConditions"
											style={{ display: showTerms ? "block" : "none" }}
										>
											<h2 className="TAC-title">
												Pet Adoption Policy and Agreement
											</h2>

											<div className="commitmentHeader">
												<h4>Responsibilities and Commitments</h4>
												<p>
													As a potential pet adopter, you agree to the following
													terms and conditions regarding the adoption and care
													of the pet:
												</p>
											</div>
											<h4>1. Understanding Pet Lifespan and Needs:</h4>
											<p>
												You are aware of the potential lifespan and specific
												needs of the pet you wish to adopt. This includes
												dietary requirements, exercise needs, grooming, and
												medical care.
											</p>

											<h4>2. Commitment to Care:</h4>
											<p>
												You are prepared for the financial, emotional, and time
												commitment required to care for the pet. This includes
												providing food, medical care, and attention throughout
												the pet's life.
											</p>

											<h4>3. Behavioral Issues:</h4>
											<p>
												You understand that pets may exhibit behavioral issues
												such as chewing, scratching, or barking. You are
												prepared to address these issues with patience and
												appropriate training.
											</p>

											<h4>4. Rehoming:</h4>
											<p>
												If you can no longer keep the pet for any reason, you
												agree to notify the adoption agency immediately. You
												will work with the agency to rehome the pet responsibly.
											</p>

											<h4>5. Safe and Loving Home:</h4>
											<p>
												You will provide a safe and loving home for the adopted
												pet, ensuring their well-being and proper care at all
												times.
											</p>

											<h4>6. Compliance with Laws:</h4>
											<p>
												You will comply with all local laws and regulations
												regarding pet ownership, including licensing and
												vaccination requirements.
											</p>

											<h4>7. Regular Check-ins and Home Visits:</h4>
											<p>
												You agree to regular check-ins and home visits by the
												adoption agency to ensure the pet's continued
												well-being. This helps the agency ensure that the pet is
												thriving in its new environment.
											</p>

											<h4>8. Agency Rights:</h4>
											<p>
												You understand that the adoption agency reserves the
												right to deny or revoke the adoption if the terms and
												conditions are not met. This ensures that the best
												interests of the pet are always prioritized.
											</p>

											<h4 className="privacyHeader">
												Privacy and Confidentiality
											</h4>

											<h4>1. Information Collection and Use:</h4>
											<p>
												The information provided in your adoption application is
												collected solely for the purpose of evaluating your
												suitability as a potential pet adopter. This information
												includes, but is not limited to, your contact details,
												household information, employment status, pet care
												experience, and personal references.
											</p>

											<h4>2. Privacy Protection:</h4>
											<p>
												All personal information submitted will be treated with
												the utmost confidentiality. Your information will be
												accessible only to authorized personnel involved in the
												adoption evaluation process, including adoption
												coordinators, volunteers, and relevant staff members.
											</p>

											<h4>3. Non-Distribution Policy:</h4>
											<p>
												Your personal information will not be sold, exchanged,
												transferred, or given to any other company or individual
												for any reason whatsoever, without your consent, other
												than for the express purpose of evaluating your adoption
												application.
											</p>

											<h4>4. Data Security:</h4>
											<p>
												We implement a variety of security measures to maintain
												the safety of your personal information. Your data will
												be stored in a secure environment to prevent
												unauthorized access, use, or disclosure.
											</p>

											<h4>5. Use of References:</h4>
											<p>
												By providing references, you authorize us to contact
												these individuals to verify the information provided and
												to discuss your suitability as a pet adopter. Your
												references will also be treated with confidentiality and
												will not be used for any purpose other than to assist in
												the evaluation of your application.
											</p>

											<h4>6. Retention and Disposal:</h4>
											<p>
												Personal information from unsuccessful applications will
												be securely disposed of after the evaluation process
												unless you provide consent for us to keep your details
												on file for future adoption opportunities.
											</p>

											<h4>7. Applicant Rights:</h4>
											<p>
												You have the right to request access to the personal
												information we hold about you and to request corrections
												if necessary. If you wish to withdraw your application,
												you may do so at any time by contacting us. Upon
												withdrawal, your information will be promptly removed
												from our records.
											</p>

											<h4>8. Consent:</h4>
											<p>
												By submitting this application, you consent to our
												collection, use, and disclosure of your personal
												information as described in these Terms and Conditions.
											</p>
										</div>
									</div>

									<p className="verTAC">
										By clicking 'Submit,' you agree to adhere to the terms and
										conditions for pet adoption outlined above.
									</p>
									<button onClick={handleSubmit} className="submitBtn">
										Submit
									</button>
								</div>
							</div>
						</div>
					</div>
					{waiting && (
						<div className="loadingOverlay">
							<img src={shibaLoading} alt="loading" className="loadingImage" />
							<p>Sending request please wait . . .</p>
						</div>
					)}
				</>
			)}
		</>
	);
}

export default AdoptPage;
