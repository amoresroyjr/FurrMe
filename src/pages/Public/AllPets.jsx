import React, { useState, useEffect, useRef } from "react";
import "../../styles/Public/AllPets.css";
import PetCard from "../../components/PetCard";
import Navbar from "../../components/Navbar";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CONFIG from "../../data/config";
import PetCardSkeleton from "../../components/PetCardSkeleton";

function AllPets() {
	const [typeClick, setTypeClick] = useState(false);
	const [genderClick, setGenderClick] = useState(false);
	const [typeCaretDirection, setTypeCaretDirection] = useState("down");
	const [genderCaretDirection, setGenderCaretDirection] = useState("down");
	const typeRef = useRef(null);
	const genderRef = useRef(null);
	const [petList, setPetList] = useState([]);
	const [filteredPets, setFilteredPets] = useState([]);
	const user = useSelector((state) => state.value);
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedType, setSelectedType] = useState("");
	const [selectedGender, setSelectedGender] = useState("");
	const [loading, setLoading] = useState(true);
	const [loadError, setLoadError] = useState(false);
	const [placeholderText, setPlaceholderText] = useState(
		"Search name, breed, or location"
	);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth <= 768) {
				setPlaceholderText("Search");
			} else {
				setPlaceholderText("Search name, breed, or location");
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);
	useEffect(() => {
		const timeout = setTimeout(() => {
			if (petList.length === 0) {
				setLoadError(true);
				setLoading(false);
			}
		}, 10000);

		axios
			.get(`${CONFIG.BASE_URL}/pets`)
			.then((res) => {
				setPetList(res.data);
				setFilteredPets(res.data);
				setLoading(false);
				setLoadError(false);
				clearTimeout(timeout);
			})
			.catch((err) => {
				console.log(err);
				setLoadError(true);
				setLoading(false);
			});

		const handleClickOutside = (event) => {
			if (
				typeRef.current &&
				!typeRef.current.contains(event.target) &&
				genderRef.current &&
				!genderRef.current.contains(event.target)
			) {
				setTypeClick(false);
				setTypeCaretDirection("down");
				setGenderClick(false);
				setGenderCaretDirection("down");
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			clearTimeout(timeout);
		};
	}, [user, navigate]);

	const handleFilterClick = (setState, setDirection, currentState) => {
		setState(!currentState);
		setDirection(currentState ? "down" : "up");
		if (currentState) {
			setTypeClick(false);
			setTypeCaretDirection("down");
			setGenderClick(false);
			setGenderCaretDirection("down");
		}
	};

	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleTypeSelect = (type) => {
		setSelectedType(type);
	};

	const handleGenderSelect = (gender) => {
		setSelectedGender(gender);
	};

	const applyFilters = () => {
		let filteredList = petList;

		if (searchTerm) {
			filteredList = filteredList.filter(
				(pet) =>
					pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
					pet.address.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		if (selectedType) {
			filteredList = filteredList.filter(
				(pet) => pet.category.toLowerCase() === selectedType.toLowerCase()
			);
		}

		if (selectedGender) {
			filteredList = filteredList.filter(
				(pet) => pet.gender.toLowerCase() === selectedGender.toLowerCase()
			);
		}

		setFilteredPets(filteredList);
	};

	useEffect(() => {
		applyFilters();
	}, [searchTerm, selectedGender, selectedType, petList]);

	return (
		<div>
			<Navbar />
			<div className="allPets">
				<div className="allPetsHeader">
					<div className="headerImgContainer">
						<div className="bannerImg">
							<p>
								In the quiet shelter, amidst the echoing halls, volunteers
								whisper stories of forever homes, weaving dreams of love and
								belonging for every lonely paw that wanders in. In their patient
								hands, hope is not just a word but a promise, whispered through
								gentle strokes and warm embraces, guiding each forgotten soul
								towards a brighter tomorrow.
							</p>
						</div>
					</div>
					<div className="headerTitle">
						<h1>All Pets for Adoption</h1>
						<hr />
						<div className="searchBarContainer">
							<span className="searchWrapper">
								<input
									type="text"
									className="searchBar"
									placeholder={placeholderText}
									value={searchTerm}
									onChange={handleSearchChange}
								/>
								<IoIosSearch className="searchIcon" />
							</span>
						</div>
					</div>
				</div>
				<div className="filter-dropdowns">
					<div
						className="petFilter typeFilter"
						onClick={() =>
							handleFilterClick(setTypeClick, setTypeCaretDirection, typeClick)
						}
						ref={typeRef}
					>
						<div className="filterTitle">
							<p>{selectedType ? `${selectedType}` : "Type"}</p>
							<i className={`fa-solid fa-caret-${typeCaretDirection}`}></i>
						</div>

						<ul className={typeClick ? "filterMenu active" : "filterMenu"}>
							<li onClick={() => handleTypeSelect("Dogs")}>Dogs</li>
							<li onClick={() => handleTypeSelect("Cats")}>Cats</li>
							<li onClick={() => handleTypeSelect("Rodents")}>Rodents</li>
							{selectedType && (
								<li
									className="clear-option"
									onClick={() => setSelectedType("")}
								>
									<i class="fa fa-times" aria-hidden="true"></i>
								</li>
							)}
						</ul>
					</div>

					<div
						className="petFilter colorFilter"
						onClick={() =>
							handleFilterClick(
								setGenderClick,
								setGenderCaretDirection,
								genderClick
							)
						}
						ref={genderRef}
					>
						<div className="filterTitle">
							<p>{selectedGender ? ` ${selectedGender}` : "Gender"}</p>
							<i className={`fa-solid fa-caret-${genderCaretDirection}`}></i>
						</div>
						<ul className={genderClick ? "filterMenu active" : "filterMenu"}>
							<li onClick={() => handleGenderSelect("Male")}>Male</li>
							<li onClick={() => handleGenderSelect("Female")}>Female</li>
							{selectedGender && (
								<li
									className="clear-option"
									onClick={() => setSelectedGender("")}
								>
									<i class="fa fa-times" aria-hidden="true"></i>
								</li>
							)}
						</ul>
					</div>
				</div>
				<div className="petsContainer">
					{loading ? (
						Array(6)
							.fill()
							.map((_, i) => <PetCardSkeleton key={i} />)
					) : loadError ? (
						<h1 className="noPetsMessage">
							Pets can't be loaded at this time. Please try again later.
						</h1>
					) : filteredPets.length === 0 ? (
						<h1 className="noPetsMessage">
							No pets available for adoption at the moment.
						</h1>
					) : (
						filteredPets.map((pet, i) => <PetCard key={i} data={pet} />)
					)}
				</div>
			</div>
		</div>
	);
}

export default AllPets;
