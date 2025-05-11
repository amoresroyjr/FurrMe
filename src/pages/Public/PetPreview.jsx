import React, { useEffect, useRef, useState } from "react";
import "../../styles/Public/PetPreview.css";
import Navbar from "../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Breadcrumbs from "../../components/Breadcrumbs";
import circleLoading from "../../assets/circleLoading.gif";
import sorry from "../../assets/sorry.gif";
import axios from "axios";
import CONFIG from "../../data/config";
import LoadingOverlay from "../../components/LoadingOverlay";

function PetPreview() {
	const containerRef = useRef(null);
	const { id } = useParams();
	const navigate = useNavigate();
	const user = useSelector((state) => state.value);
	const [petData, setpetData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const customNames = petData
		? {
				[id]: petData.name,
			}
		: {};
	const [selectedImg, setSelectedImg] = useState(null);

	useEffect(() => {
		axios
			.get(`${CONFIG.BASE_URL}/petPreview/${id}`)
			.then((res) => {
				setpetData(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setError(true);
				setLoading(false);
			});
	}, [id]);

	const retryFetch = () => {
		setLoading(true);
		setError(false);
		axios
			.get(`${CONFIG.BASE_URL}/petPreview/${id}`)
			.then((res) => {
				setpetData(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setError(true);
				setLoading(false);
			});
	};

	const handleImageClick = (imgSrc) => {
		setSelectedImg(imgSrc);
	};
	const handleWheel = (e) => {
		const container = containerRef.current;
		if (container) {
			container.scrollLeft += e.deltaY;
		}
	};

	const confirmAdoption = () => {
		if (user === null) {
			navigate("/login");
		} else {
			navigate(`/pets/${petData.pet_id}/adopt`, {
				state: petData,
			});
		}
	};

	return (
		<>
			{loading ? (
				<LoadingOverlay gifSrc={circleLoading} label="Loading..." />
			) : error ? (
				<LoadingOverlay
					gifSrc={sorry}
					label="Can't get details of the pet. Please check your internet connection."
				>
					<div className="errorBtnGroup">
						<button className="goBackBtn" onClick={() => navigate(-1)}>
							Go Back
						</button>
						<button className="retryBtn" onClick={retryFetch}>
							Try Again
						</button>
					</div>
				</LoadingOverlay>
			) : (
				<div>
					<Navbar />
					<div className="petPreview">
						<Breadcrumbs customNames={customNames} />
						<div className="petPreviewDetails">
							<div className="petImgSec">
								<div className="selectedImgContainer">
									<img src={selectedImg || petData.image} alt={petData.name} />
								</div>
								<div
									className="petImgCollection"
									ref={containerRef}
									onWheel={handleWheel}
								>
									<div
										className="imgBoxes"
										onMouseEnter={() => handleImageClick(petData.image)}
									>
										<img src={petData.image} alt="img1" />
									</div>

									{petData.img2 && (
										<div
											className="imgBoxes"
											onMouseEnter={() => handleImageClick(petData.img2)}
										>
											<img src={petData.img2} alt="img2" />
										</div>
									)}

									{petData.img3 && (
										<div
											className="imgBoxes"
											onMouseEnter={() => handleImageClick(petData.img3)}
										>
											<img src={petData.img3} alt="img3" />
										</div>
									)}
									{petData.img4 && (
										<div
											className="imgBoxes"
											onMouseEnter={() => handleImageClick(petData.img4)}
										>
											<img src={petData.img4} alt="img4" />
										</div>
									)}
									{petData.img5 && (
										<div
											className="imgBoxes"
											onMouseEnter={() => handleImageClick(petData.img5)}
										>
											<img src={petData.img5} alt="img5" />
										</div>
									)}
								</div>
							</div>
							<div className="petInfoContainer">
								<h1 className="petNameInfo">{petData.name}</h1>
								<div className="petInfoList">
									<h2>Pet Information:</h2>
									<h3>Breed: {petData.breed}</h3>
									<h3>Color: {petData.color}</h3>
									<h3>Age: {petData.age}</h3>
									<h3>Gender: {petData.gender}</h3>
									<h3>Behavior: {petData.behavior}</h3>
									<h3>Health: {petData.health}</h3>
									<h3 className="petDescriptionInfo">
										Description: {petData.description}
									</h3>
								</div>
								<button
									onClick={() => confirmAdoption()}
									className="adoptionInqBtn"
								>
									Inquire of Adoption
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}

export default PetPreview;
