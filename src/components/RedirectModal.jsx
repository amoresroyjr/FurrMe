import React, { useEffect } from "react";
import "../styles/Components/RedirectModal.css";
import { useNavigate } from "react-router-dom";

const RedirectModal = ({ isOpen, onClose, title, children, link }) => {
	const navigate = useNavigate();

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (e.target.classList.contains("rmodal-overlay")) {
				onClose();
				navigate(link);
			}
		};

		if (isOpen) {
			document.body.addEventListener("click", handleClickOutside);
		}
		return () => {
			document.body.removeEventListener("click", handleClickOutside);
		};
	}, [isOpen, onClose]);

	const handleCloseModal = () => {
		onClose();

		setTimeout(() => {
			navigate(link);
		}, 500);
	};

	return (
		<div className={`rmodal-overlay ${isOpen ? "show" : ""}`}>
			<div className={`rmodal-content ${isOpen ? "slide-in" : "slide-out"}`}>
				<button className="rclose-button" onClick={handleCloseModal}>
					&times;
				</button>
				<h2>{title}</h2>
				<div className="rmodal-body">{children}</div>
				<button className="rokay-button" onClick={handleCloseModal}>
					Okay
				</button>
			</div>
		</div>
	);
};

export default RedirectModal;
