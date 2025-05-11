import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import { IoIosSearch } from "react-icons/io";
import axios from "axios";
import "../../styles/Public/DogsPage.css";
import PetCard from "../../components/PetCard";
import CONFIG from "../../data/config";

function DogsPage() {
	const [ageClick, setAgeClick] = useState(false);
	const [colorClick, setColorClick] = useState(false); // State for color filter
	const [ageCaretDirection, setAgeCaretDirection] = useState("down");
	const [colorCaretDirection, setColorCaretDirection] = useState("down"); // State for color caret direction
	const ageRef = useRef(null);
	const colorRef = useRef(null); // Ref for color dropdown
	const [dogList, setList] = useState([]);
	const [filteredPets, setFilteredPets] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");

	useEffect(() => {
		axios
			.get(`${CONFIG.BASE_URL}/pets/dogs`)
			.then((res) => setList(res.data))
			.catch((err) => console.log(err));

		const handleClickOutside = (event) => {
			if (
				ageRef.current &&
				!ageRef.current.contains(event.target) &&
				colorRef.current && // Check if colorRef exists
				!colorRef.current.contains(event.target)
			) {
				setAgeClick(false);
				setAgeCaretDirection("down");
				setColorClick(false); // Set colorClick to false
				setColorCaretDirection("down"); // Reset color caret direction
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleFilterClick = (setState, setDirection, currentState) => {
		setState(!currentState);
		setDirection(currentState ? "down" : "up");
		if (currentState) {
			setAgeClick(false);
			setAgeCaretDirection("down");
			setColorClick(false);
			setColorCaretDirection("down");
		}
	};
	const handleSearchChange = (e) => {
		setSearchTerm(e.target.value);
	};

	const applyFilters = () => {
		let filteredList = dogList;

		if (searchTerm) {
			filteredList = filteredList.filter(
				(pet) =>
					pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
					pet.address.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		setFilteredPets(filteredList);
	};

	useEffect(() => {
		applyFilters();
	}, [searchTerm, dogList]);

	return (
		<div>
			<Navbar user={window.localStorage.getItem("loggedUser")} />
			<div className="dogsPage">
				<div className="dp-bannerContainer">
					<div className="dp-Banner"></div>
				</div>
				<div className="searchBarContainer">
					<input
						type="text"
						className="searchBar"
						placeholder="Search name, breed, or location"
						value={searchTerm}
						onChange={handleSearchChange}
					/>
					<IoIosSearch className="searchIcon" />
				</div>
				<div className="filter-dropdowns">
					<div
						className="petFilter ageFilter"
						onClick={() =>
							handleFilterClick(
								setAgeClick,
								setAgeCaretDirection,
								ageClick,
								ageCaretDirection
							)
						}
						ref={ageRef}
					>
						<div className="filterTitle">
							<p>Age</p>
							<i className={`fa-solid fa-caret-${ageCaretDirection}`}></i>
						</div>
						<ul className={ageClick ? "filterMenu active" : "filterMenu"}>
							<li>Puppy</li>
							<li>Middle-Aged</li>
							<li>Adult</li>
						</ul>
					</div>
					<div
						className="petFilter colorFilter"
						onClick={() =>
							handleFilterClick(
								setColorClick,
								setColorCaretDirection,
								colorClick,
								colorCaretDirection
							)
						}
						ref={colorRef}
					>
						<div className="filterTitle">
							<p>Color</p>
							<i className={`fa-solid fa-caret-${colorCaretDirection}`}></i>
						</div>
						<ul className={colorClick ? "filterMenu active" : "filterMenu"}>
							<li>Orange</li>
							<li>White</li>
							<li>Black</li>
						</ul>
					</div>
				</div>
				<div className="petsContainer">
					{filteredPets.map((pet, i) => {
						return <PetCard key={i} data={pet} />;
					})}
				</div>
			</div>
		</div>
	);
}

export default DogsPage;
