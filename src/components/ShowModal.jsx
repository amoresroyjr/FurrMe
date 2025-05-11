import React, { useEffect } from "react";
import "../styles/Components/RedirectModal.css"; // Assuming you renamed the CSS to match your needs

const ShowModal = ({ isOpen, onClose, title, children }) => {
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (e.target.classList.contains("rmodal-overlay")) {
				onClose();
			}
		};

		if (isOpen) {
			document.body.addEventListener("click", handleClickOutside);
		}

		return () => {
			document.body.removeEventListener("click", handleClickOutside);
		};
	}, [isOpen, onClose]);

	return (
		<div className={`rmodal-overlay ${isOpen ? "show" : ""}`}>
			<div className={`rmodal-content ${isOpen ? "slide-in" : "slide-out"}`}>
				<button className="rclose-button" onClick={onClose}>
					&times;
				</button>
				<h2>{title}</h2>
				<div className="rmodal-body">{children}</div>
				<button className="rokay-button" onClick={onClose}>
					Okay
				</button>
			</div>
		</div>
	);
};

export default ShowModal;
