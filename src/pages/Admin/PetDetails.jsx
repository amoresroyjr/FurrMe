import React, { useState, useEffect, useRef } from "react";
import "../../styles/Admin/PetDetails.css";
import AdminDashboardSidebar from "../../components/AdminSidebar";
/*import {
    MdOutlineKeyboardArrowDown,
    MdOutlineKeyboardArrowUp,
} from "react-icons/md";*/
import { IoCloseCircle } from "react-icons/io5";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import LoadingOverlay from "../../components/LoadingOverlay";
import catLoading2 from "../../assets/catLoading2.gif";
import catLoading1 from "../../assets/catLoading.gif";
import sorry from "../../assets/sorry.gif";
import CountDownModal from "../../components/CountdownModal";
import CONFIG from "../../data/config";

function PetDetails() {
	const navigate = useNavigate();
	const getData = useSelector((state) => state.value);
	const token = getData.token;
	const { category, id } = useParams();
	const [petInfo, setpetInfo] = useState([]);
	const [petImage, setpetImage] = useState([]);
	const [loading, setLoading] = useState(true);
	const [uploading, setUploading] = useState(false);
	const [uploadingText, setUploadingText] = useState("Uploading...");
	const [images, setImages] = useState([]);
	const [base64s, setbase64s] = useState([]);
	const [isChanged, setIsChanged] = useState(false);
	const [error, setError] = useState(false);
	const [modalContents, setmodalContents] = useState({
		title: "",
		contents: "",
	});
	const [isModalOpen, setIsModalOpen] = useState(false);

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	useEffect(() => {
		setLoading(false);
		let array = Object.values(petImage);
		array = array.filter((item) => item !== null);
		setImages(Object.values(array));
	}, [petImage]);

	useEffect(() => {
		setLoading(true);

		const fetchData = async () => {
			try {
				const [infoRes, imgRes] = await Promise.all([
					axios.get(`${CONFIG.BASE_URL}/admin/petDetails/${id}`, {
						headers: { token },
					}),
					axios.get(`${CONFIG.BASE_URL}/admin/petImage/${id}`, {
						headers: { token },
					}),
				]);
				setpetInfo(infoRes.data);
				setpetImage(imgRes.data);
				setError(false);
			} catch (err) {
				console.log(err);
				setError(true);
			}
			setLoading(false);
		};

		fetchData();
	}, [id, token]);

	const handleRetry = () => {
		setError(false);
		setLoading(true);
		navigate(0);
	};

	const handleInputChange = (e) => {
		e.preventDefault();
		setIsChanged(true);
		const { name, value } = e.target;
		setpetInfo((prevState) => ({ ...prevState, [name]: value }));
	};

	const handleUploadClick = async () => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.multiple = true;

		fileInput.onchange = (event) => {
			const files = Array.from(event.target.files);
			if (files.length + images.length > 5) {
				setmodalContents({
					title: "Update Error!",
					contents: "You can only upload up to 5 photos.",
				});
				return;
			}
			files.map(async (file) => {
				const result = await convertBlobToBase64(file);
				return result;
			});
			const newImages = files.map((file) => URL.createObjectURL(file));
			setImages((prevImages) => [...prevImages, ...newImages]);
			setIsChanged(true);
		};
		fileInput.click();
	};

	function convertBlobToBase64(blob) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				resolve(reader.result); // This will be the Base64 string
			};
			reader.onerror = reject;
			reader.readAsDataURL(blob); // Reads the Blob as a Data URL (base64)
		}).then((res) => base64s.push(res));
	}

	const removeBlob = () => {
		const index2 = images.findIndex((item) => item.includes("blob"));

		if (index2 !== -1) {
			images.splice(index2, 1); // Remove the item at the found index
		}
	};

	const handleSubmit = (e) => {
		if (!images[0]) {
			// Remove the uploaded image
			setIsModalOpen(!isModalOpen);
			setmodalContents({
				title: "Image cannot be empty!",
				contents: "Select at least one image",
			});
			setImages([]);
			return;
		}
		if (base64s[0]) {
			setUploading(true);
			base64s.forEach(async function (item, index) {
				try {
					const res = await axios.post(`${CONFIG.BASE_URL}/upload`, {
						image_url: item,
					});
					images.push(res.data);
				} catch (err) {
					console.log(err);
				}

				if (images.some((item) => item.includes("blob"))) {
					removeBlob(); // remove blob links from the images list
				}
				base64s.splice(0, 1);
				if (!base64s[0]) {
					setUploadingText("Updating...");
					update(petInfo, images);
				}
			});
		}
		if (!base64s[0]) {
			setUploadingText("Updating...");
			update(petInfo, images);
		}
	};

	const update = (info, imagess) => {
		axios
			.post(`${CONFIG.BASE_URL}/admin/petInfoUpdate`, {
				info: info,
				images: imagess,
				token: token,
			})
			.then((res) => {
				setUploadingText("Successful");
				if (res.data === 0) {
					setUploadingText("Successful");
					setIsModalOpen(!isModalOpen);
					setmodalContents({
						title: "Information Updated Successfully",
					});
				} else {
					setIsModalOpen(!isModalOpen);
					setmodalContents({
						title: "Update Error!",
					});
				}
			})
			.catch((err) => console.log(err));
	};

	const handleRemoveImage = (index) => {
		setImages(images.filter((_, i) => i !== index));
		setbase64s(base64s.filter((_, i) => i !== index));
		setIsChanged(true);
	};

	const handleImageClick = (image) => {
		window.open(image, "_blank");
	};

	return (
		<>
			<div>
				<CountDownModal
					isOpen={isModalOpen}
					onClose={toggleModal}
					title={modalContents.title}
				>
					<p>{modalContents.contents}</p>
				</CountDownModal>
				{uploading && (
					<LoadingOverlay gifSrc={catLoading1} label={uploadingText} />
				)}
				{loading && (
					<LoadingOverlay gifSrc={catLoading2} label="Loading . . ." />
				)}
				{error && (
					<LoadingOverlay
						gifSrc={sorry}
						label="Can't connect. Please check your internet connection."
					>
						<div className="errorBtnGroup">
							<button className="goBackBtn" onClick={() => navigate(-1)}>
								Go Back
							</button>
							<button className="retryBtn" onClick={handleRetry}>
								Try Again
							</button>
						</div>
					</LoadingOverlay>
				)}

				<div className="adminPetPreview">
					<AdminDashboardSidebar />
					<div className="mainContent">
						<div className="divider">
							<div className="petInfoCont">
								<h2>Pet Information</h2>
								<div className="allPetInfo">
									<div className="infoCont name-type">
										<div className="infoSet nameSet">
											<label htmlFor="name">Name</label>
											<input
												type="text"
												id="name"
												name="name"
												value={petInfo.name}
												onChange={handleInputChange}
											/>
										</div>
										<div className="infoSet TypeSet">
											<label htmlFor="type">Type</label>
											<input
												readOnly
												type="text"
												id="type"
												value={petInfo.category}
											/>
										</div>
									</div>
									<div className="infoCont breed-color">
										<div className="infoSet breedSet">
											<label htmlFor="breed">Breed</label>
											<input
												readOnly
												type="text"
												id="breed"
												value={petInfo.breed}
											/>
										</div>
										<div className="infoSet colorSet">
											<label htmlFor="color">Color</label>
											<input
												type="text"
												name="color"
												value={petInfo.color}
												onChange={handleInputChange}
											/>
										</div>
									</div>
									<div className="infoCont age-gender">
										<div className="infoSet ageSet">
											<label htmlFor="age">Age</label>
											<input
												type="text"
												name="age"
												value={petInfo.age}
												onChange={handleInputChange}
											/>
										</div>
										<div className="infoSet genderSet">
											<label htmlFor="gender">Gender</label>
											<input readOnly type="text" value={petInfo.gender} />
										</div>
									</div>
									<div className="textAreaConts">
										<div className="TA-set behavior">
											<label htmlFor="behavior">Behavior</label>
											<textarea
												name="behavior"
												id="behavior"
												maxLength="100"
												value={petInfo.behavior}
												onChange={handleInputChange}
											></textarea>
											<p className="charCount"></p>
										</div>
										<div className="TA-set health">
											<label htmlFor="health">Health</label>
											<textarea
												name="health"
												id="health"
												maxLength="200"
												value={petInfo.health}
												onChange={handleInputChange}
											></textarea>
											<p className="charCount"></p>
										</div>
										<div className="TA-set description">
											<label htmlFor="description">Description</label>
											<textarea
												name="description"
												id="description"
												maxLength="300"
												value={petInfo.description}
												onChange={handleInputChange}
											></textarea>
											<p className="charCount"></p>
										</div>
									</div>
									{isChanged && (
										<button
											onClick={() => handleSubmit()}
											className="saveChanges"
										>
											Save Changes
										</button>
									)}
								</div>
							</div>
							<div className="petImagesContainer">
								<div className="petImgBox">
									{images.map((image, index) => (
										<div className="img-container" key={index}>
											<img
												src={image}
												alt={`pet-${index}`}
												onClick={() => handleImageClick(image)}
											/>
											<IoCloseCircle
												className="closeIcon"
												onClick={() => handleRemoveImage(index)}
											/>
										</div>
									))}
								</div>
								<button className="uploadPhotos" onClick={handleUploadClick}>
									Upload Photos
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default PetDetails;
