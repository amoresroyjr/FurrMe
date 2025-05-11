import React from "react";
import "../styles/Components/LoadingOverlay.css";

const LoadingOverlay = ({ gifSrc, label, children }) => {
	return (
		<div className="overlay">
			<div className="loading-content">
				<img src={gifSrc} alt="Loading..." className="loading-gif" />
				{label && <p className="loading-label">{label}</p>}
				{children && <div className="loading-extra">{children}</div>}
			</div>
		</div>
	);
};

export default LoadingOverlay;
