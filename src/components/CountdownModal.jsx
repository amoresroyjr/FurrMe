import React, { useState, useEffect, useRef } from "react";
import "../styles/Components/CountDownModal.css";

const CountDownModal = ({ isOpen, onClose, title, children, link }) => {
	const [countdown, setCountdown] = useState(5);
	const timerRef = useRef(null);

	useEffect(() => {
		if (isOpen) {
			setCountdown(5);
			timerRef.current = setInterval(() => {
				setCountdown((prevCountdown) => {
					if (prevCountdown <= 1) {
						clearInterval(timerRef.current);
						onClose();
					}
					return prevCountdown - 1;
				});
			}, 1000);
		} else {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		}

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
			}
		};
	}, [isOpen, onClose]);

	const handleOverlayClick = (e) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div className={`modal-content ${isOpen ? "slide-in" : "slide-out"}`}>
			<button className="close-button" onClick={onClose}>
				&times;
			</button>
			<h2>{title}</h2>
			{link ? (
				<div className="modal-body">
					See Listing <a href={link}>here</a>
				</div>
			) : (
				<div className="modal-body">{children}</div>
			)}

			{/* Countdown Timer */}
			<div className="countdown-timer">
				<p>Closing in: {countdown} seconds</p>
			</div>
		</div>
	);
};

export default CountDownModal;
