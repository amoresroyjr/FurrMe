import React, { useState, useRef, useEffect } from "react";
import "../../styles/Admin/AdoptionRequests.css";
import AdminDashboardSidebar from "../../components/AdminSidebar";
import { IoIosSearch } from "react-icons/io";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
//import LoadingOverlay from "../../components/LoadingOverlay";
//import catLoading2 from "../../assets/catLoading2.gif";
import { IoNotificationsOutline } from "react-icons/io5";
import CONFIG from "../../data/config";

function AdoptionRequests() {
	const navigate = useNavigate();
	const getData = useSelector((state) => state.value);
	const token = getData.token;
	const [currentPage, setCurrentPage] = useState(1);
	const [searchInput, setSearchInput] = useState("");
	const [selectedPet, setSelectedPet] = useState("All Pets");
	const [selectedStatus, setSelectedStatus] = useState("Status");
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
	const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);
	const [adminPetRequests, setAdminPetRequests] = useState([]);
	const rowsPerPage = 10;
	const dropdownRef = useRef(null);
	const statusDropdownRef = useRef(null);
	const [loading, setLoading] = useState(true);
	const [isMobileView, setIsMobileView] = useState(false);

	useEffect(() => {
		axios
			.get(`${CONFIG.BASE_URL}/adoption/list`, {
				headers: {
					token: token,
				},
			})
			.then((res) => {
				setAdminPetRequests(res.data);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setLoading(false);
			});
	}, []);

	const handlePreviousPage = () => {
		setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
	};

	const handleNextPage = () => {
		setCurrentPage((prevPage) =>
			Math.min(prevPage + 1, Math.ceil(filteredRequests.length / rowsPerPage))
		);
	};

	const handleSearchInputChange = (event) => {
		setSearchInput(event.target.value);
		setCurrentPage(1);
		setSelectedPet("All Pets");
		setSelectedStatus("Status");
		setIsDropdownOpen(false);
		setIsStatusDropdownOpen(false);
	};

	const handleOptionClick = (petType) => {
		setSelectedPet(petType);
		setIsDropdownOpen(false);
		setCurrentPage(1);
		setSearchInput(""); // Reset the search input when dropdown is used
	};

	const handleStatusOptionClick = (status) => {
		setSelectedStatus(status);
		setIsStatusDropdownOpen(false);
		setCurrentPage(1);
		setSearchInput(""); // Reset the search input when dropdown is used
	};

	const filteredRequests = adminPetRequests.filter((request) => {
		const petMatch =
			selectedPet === "All Pets" || request.category === selectedPet;
		const statusMatch =
			selectedStatus === "Status" || request.status === selectedStatus;
		return (
			petMatch &&
			statusMatch &&
			request.pet_name.toLowerCase().includes(searchInput.toLowerCase())
		);
	});

	const startIndex = (currentPage - 1) * rowsPerPage;
	const currentRequests = filteredRequests.slice(
		startIndex,
		startIndex + rowsPerPage
	);

	useEffect(() => {
		const handleResize = () => {
			setIsMobileView(window.innerWidth < 450);
		};

		handleResize(); // Initial check
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsDropdownOpen(false);
			}

			if (
				statusDropdownRef.current &&
				!statusDropdownRef.current.contains(event.target)
			) {
				setIsStatusDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
		setIsStatusDropdownOpen(false);
	};

	const toggleStatusDropdown = () => {
		setIsStatusDropdownOpen(!isStatusDropdownOpen);
		setIsDropdownOpen(false);
	};
	const petPreview = (pet) => {
		navigate("/admin/pets/evaluate/" + pet.pet_name, { state: pet });
	};

	return (
		<>
			<div className="adminAdoptionRequests">
				<AdminDashboardSidebar />
				<div className="mainContent">
					<div className="header">
						<h2>Requests</h2>
						<div
							className={`searchBar ${isSearchBarFocused ? "highlighted" : ""}`}
						>
							<IoIosSearch className="searchIcon" />
							<input
								type="text"
								placeholder={isMobileView ? "Search" : "Search pets..."}
								value={searchInput}
								onChange={handleSearchInputChange}
								onFocus={() => setIsSearchBarFocused(true)}
								onBlur={() => setIsSearchBarFocused(false)}
								onClick={() => {
									setIsDropdownOpen(false);
									setIsStatusDropdownOpen(false);
								}}
							/>
						</div>
						<div className="tableFilters">
							<div className="dropdowns" ref={dropdownRef}>
								<p className="dropdownItem" onClick={toggleDropdown}>
									{selectedPet}{" "}
									{isDropdownOpen ? (
										<MdKeyboardArrowUp />
									) : (
										<MdKeyboardArrowDown />
									)}
								</p>
								{isDropdownOpen && (
									<div className="dropdown">
										<ul>
											<li onClick={() => handleOptionClick("All Pets")}>
												All Pets
											</li>
											<li onClick={() => handleOptionClick("Dogs")}>Dogs</li>
											<li onClick={() => handleOptionClick("Cats")}>Cats</li>
										</ul>
									</div>
								)}
							</div>
							<div className="dropdowns" ref={statusDropdownRef}>
								<p className="dropdownItem" onClick={toggleStatusDropdown}>
									{selectedStatus}{" "}
									{isStatusDropdownOpen ? (
										<MdKeyboardArrowUp />
									) : (
										<MdKeyboardArrowDown />
									)}
								</p>
								{isStatusDropdownOpen && (
									<div className="dropdown">
										<ul>
											<li onClick={() => handleStatusOptionClick("Status")}>
												Status
											</li>
											<li onClick={() => handleStatusOptionClick("Pending")}>
												Pending
											</li>
											<li onClick={() => handleStatusOptionClick("Approved")}>
												Approved
											</li>
											<li onClick={() => handleStatusOptionClick("Rejected")}>
												Rejected
											</li>
										</ul>
									</div>
								)}
							</div>
						</div>
						<IoNotificationsOutline className="notificationIcon" />
					</div>
					<h2 className="centeredTitle">Adoption Requests</h2>
					<div className="tableContainer">
						<table>
							<thead>
								<tr>
									<th className="col-date">Date</th>
									<th className="col-name">Name</th>
									<th className="col-email">Email</th>
									<th className="col-pet">Pet</th>
									<th className="col-status">Status</th>
								</tr>
							</thead>
							<tbody>
								{loading ? (
									[...Array(10)].map((_, index) => (
										<tr key={index} className="skeletonRow">
											<td>
												<div className="skeleton skeleton-text"></div>
											</td>
											<td>
												<div className="skeleton skeleton-text"></div>
											</td>
											<td>
												<div className="skeleton skeleton-text"></div>
											</td>
											<td>
												<div className="skeleton skeleton-text"></div>
											</td>
											<td>
												<div className="skeleton skeleton-text"></div>
											</td>
										</tr>
									))
								) : currentRequests.length === 0 ? (
									<tr>
										<td colSpan="5">No Pet Requests Found</td>
									</tr>
								) : (
									currentRequests.map((request, i) => (
										<tr key={i} onClick={() => petPreview(request)}>
											<td>
												{new Date(request.requested_at).toLocaleDateString(
													"en-US",
													{
														year: "numeric",
														month: "short",
														day: "numeric",
													}
												)}
											</td>
											<td>{request.pet_name}</td>
											<td>{request.email}</td>
											<td>{request.category}</td>
											<td>{request.status}</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
					<div className="tableNav">
						<div className="pageNav" onClick={handlePreviousPage}>
							<FaAngleLeft className="navIcon" />
							<p>Previous</p>
						</div>
						<p className="pageNum">
							Page {currentPage} of{" "}
							{Math.ceil(filteredRequests.length / rowsPerPage)}
						</p>
						<div className="pageNav" onClick={handleNextPage}>
							<p>Next</p>
							<FaAngleRight className="navIcon" />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default AdoptionRequests;
