import React, { useEffect, useState } from "react";
import "../styles/Components/AdminSidebar.css";
import { IoPawOutline, IoPeopleOutline } from "react-icons/io5";
import { TbMessageReport } from "react-icons/tb";
import {
	CiCirclePlus,
	CiLogout,
	CiCircleChevLeft,
	CiCircleChevRight,
} from "react-icons/ci";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/Users";

function AdminDashboardSidebar() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [collapsed, setCollapsed] = useState(
		() => JSON.parse(localStorage.getItem("sidebarCollapsed")) || false
	);

	useEffect(() => {
		localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
	}, [collapsed]);

	const handleLogout = () => {
		dispatch(logout());
		navigate("/");
	};

	return (
		<div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
			<div className="header">
				<Link to="/admin/pets" className="logo">
					<img
						src={
							"https://res.cloudinary.com/dmquudoki/image/upload/v1716127273/FurrMe_Logo_sba9mx.png"
						}
						className="webLogo"
						alt="FurrMe Logo"
					/>
					{!collapsed && <h2>FurrMe</h2>}
				</Link>
			</div>
			<div className="collapseToggle" onClick={() => setCollapsed(!collapsed)}>
				{collapsed ? (
					<CiCircleChevRight size={24} />
				) : (
					<CiCircleChevLeft size={24} />
				)}
			</div>
			<div className="sidebarNav">
				<ul>
					<Link to="/admin/pets">
						<li>
							<IoPawOutline className="navIcon" />
							<span>Pets</span>
						</li>
					</Link>
					<Link to="/admin/requests">
						<li>
							<IoPeopleOutline className="navIcon" />
							<span>Adoption Requests</span>
						</li>
					</Link>
					<Link to="/admin/create">
						<li>
							<CiCirclePlus className="navIcon" />
							<span>Create Pet Listing</span>
						</li>
					</Link>
					<Link to="/admin/reports">
						<li>
							<TbMessageReport className="navIcon" />
							<span>Reports</span>
						</li>
					</Link>
					<li onClick={handleLogout}>
						<CiLogout className="navIcon" />
						<span>Logout</span>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default AdminDashboardSidebar;
