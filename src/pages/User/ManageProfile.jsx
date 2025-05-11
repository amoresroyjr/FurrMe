import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/User/ManageProfile.css";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../../store/Users";
import CountDownModal from "../../components/CountdownModal";
import uploadingImg from "../../assets/uploadingImg.gif";
import CONFIG from "../../data/config";

function ManageProfile() {
	const dispatch = useDispatch();
	const getData = useSelector((state) => state.value);
	const user = getData.user;
	const [uploadedImg, setUploadedImg] = useState(user.image);
	const [showSaveBtn, setSaveBtn] = useState(false);
	const navigate = useNavigate();
	const [errors, setErrors] = useState({});
	const defaultValues = {
		fname: user.fname,
		lname: user.lname,
		email: user.email,
		pass: "",
		npass: "",
		cpass: "",
	};

	const [formData, setformData] = useState(defaultValues);
	const token = getData.token;
	const [access, setAccess] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalContents, setmodalContents] = useState({
		title: "",
		contents: "",
	});
	const [isUploading, setIsUploading] = useState(false);
	const [uploadMessage, setUploadMessage] = useState("Updating . . .");
	const [showPasswordSection, setShowPasswordSection] = useState(false);

	const resetFormWithUser = (u = user) => {
		setformData({
			fname: u.fname,
			lname: u.lname,
			email: u.email,
			pass: "",
			npass: "",
			cpass: "",
		});
		setUploadedImg(u.image);
		setSaveBtn(false);
		setErrors({});
	};

	const togglePasswordSection = () => {
		setShowPasswordSection((prev) => !prev);
		resetFormWithUser();
	};

	const handleInputChange = (e) => {
		e.preventDefault();
		const { name, value } = e.target;
		setformData((prevState) => ({ ...prevState, [name]: value }));
	};

	useEffect(() => {
		if (access === 1) {
			navigate("/profile");
			setSaveBtn(false);
			setformData(defaultValues);
		}
	}, [access]);

	useEffect(() => {
		if (showPasswordSection) {
			const allPasswordsFilled =
				formData.pass && formData.npass && formData.cpass;
			setSaveBtn(!!allPasswordsFilled);
		} else {
			const hasChanges =
				formData.fname !== user.fname ||
				formData.lname !== user.lname ||
				formData.email !== user.email ||
				(uploadedImg && uploadedImg !== user.image);
			setSaveBtn(hasChanges);
		}
	}, [formData, uploadedImg, showPasswordSection, user]);

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);

		if (!isModalOpen) {
			setformData((prevState) => ({
				...prevState,
				pass: "",
			}));
		}
	};

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

	const getChangedFields = () => {
		const changes = {
			prevEmail: user.email,
			token,
			pass: formData.pass,
		};

		if (formData.fname !== user.fname) changes.fname = formData.fname;
		if (formData.lname !== user.lname) changes.lname = formData.lname;
		if (formData.email !== user.email) changes.newEmail = formData.email;

		if (showPasswordSection) {
			if (
				formData.pass !== formData.npass &&
				formData.npass === formData.cpass
			) {
				changes.npass = formData.npass;
			}
		}

		return changes;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationErrors = {};

		if (showPasswordSection) {
			if (formData.pass === formData.npass) {
				validationErrors.npass =
					"New password cannot be the same as old password";
			}
			if (formData.npass !== formData.cpass) {
				validationErrors.cpass = "New passwords do not match";
			}
		}

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		let changedFields = getChangedFields();

		try {
			if (uploadedImg && uploadedImg !== user.image) {
				setIsUploading(true);
				setUploadMessage("Uploading . . .");

				const res = await axios.post(`${CONFIG.BASE_URL}/upload`, {
					image_url: uploadedImg,
				});
				changedFields.image = res.data;
			}

			setUploadMessage("Updating . . .");
			setIsUploading(true);

			const res = await axios.patch(`${CONFIG.BASE_URL}/manage`, changedFields);

			setAccess(res.data.access);
			setmodalContents({
				title: res.data.access === 1 ? "Success" : "Error",
				contents: res.data.message || "Something went wrong. Please try again.",
			});
			setIsModalOpen(true);

			if (res.data.access === 1) {
				const updatedUser = res.data.userData;
				dispatch(login({ token: res.data.token, user: updatedUser }));
				resetFormWithUser(updatedUser);
			} else {
				dispatch(login({ token, user }));
			}
		} catch (err) {
			console.error("Update failed", err);
			setmodalContents({
				title: "Update Failed",
				contents:
					"An error occurred during the update. Please try again later.",
			});
			setIsModalOpen(true);
		} finally {
			setIsUploading(false);
		}
	};

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setUploadedImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div>
			<CountDownModal
				isOpen={isModalOpen}
				onClose={toggleModal}
				title={modalContents.title}
			>
				<p>{modalContents.contents}</p>
			</CountDownModal>
			<Navbar />
			<div className="manageProfile">
				<div className="container">
					{!showPasswordSection && (
						<>
							<h2>Profile</h2>
							<p>
								This information will be displayed publicly so be careful what
								you share.
							</p>
							<hr />
							<div className="profilePicture">
								<label>Photo</label>
								<div className="profilePictureContainer">
									{uploadedImg ? (
										<img src={uploadedImg} alt={user.fname} />
									) : (
										<img src={user.image} alt={user.fname} />
									)}
								</div>
								<label htmlFor="uploadImg" className="btnChangeDP">
									Change
								</label>
								<input
									type="file"
									id="uploadImg"
									accept=".jpg,.jpeg,.png"
									style={{ display: "none" }}
									onChange={handleImageUpload}
								/>
							</div>
							<hr />
							<div className="firstName">
								<label htmlFor="firstName">First Name</label>
								<input
									type="text"
									id="firstName"
									value={formData.fname}
									name="fname"
									onChange={handleInputChange}
								/>
							</div>
							<hr />
							<div className="lastName">
								<label htmlFor="lastName">Last Name</label>
								<input
									type="text"
									id="lastName"
									value={formData.lname}
									name="lname"
									onChange={handleInputChange}
								/>
							</div>
							<hr />
							<div className="email">
								<label htmlFor="email">Email</label>
								<input
									type="email"
									id="email"
									value={formData.email}
									name="email"
									onChange={handleInputChange}
								/>
							</div>
							<hr />
						</>
					)}
					{showPasswordSection && (
						<>
							<h2>Change Password</h2>
							<hr />
							<div className="password">
								<label htmlFor="password">Password</label>
								<input
									type="password"
									id="password"
									value={formData.pass}
									name="pass"
									onChange={handleInputChange}
								/>
							</div>
							<hr />
							<div className="password">
								<label htmlFor="npassword">New Password</label>
								<input
									type="password"
									id="npassword"
									value={formData.npass}
									name="npass"
									onChange={handleInputChange}
								/>
							</div>
							<hr />
							<div className="password">
								<label htmlFor="cpassword">Confirm Password</label>
								<input
									type="password"
									id="cpassword"
									value={formData.cpass}
									name="cpass"
									onChange={handleInputChange}
								/>
							</div>
							<hr />
						</>
					)}

					<div className="buttonGroup">
						<button className="changepassBtn" onClick={togglePasswordSection}>
							{showPasswordSection ? "Change Info" : "Change Password"}
						</button>

						{showSaveBtn && (
							<button onClick={handleSubmit} className="btnSaveChanges">
								Save
							</button>
						)}
					</div>
					{Object.keys(errors).length > 0 && (
						<div className="mergedWarnings">
							{errors.pass && <p>{errors.pass}</p>}
							{errors.npass && <p>{errors.npass}</p>}
							{errors.cpass && <p>{errors.cpass}</p>}
						</div>
					)}
				</div>

				{isUploading && (
					<div className="loadingOverlay">
						<img src={uploadingImg} alt="loading" className="loadingImage" />
						<p>{uploadMessage}</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default ManageProfile;
