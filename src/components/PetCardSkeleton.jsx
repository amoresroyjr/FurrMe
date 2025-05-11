import React from "react";
import "./PetCardSkeleton.css";

function PetCardSkeleton() {
	return (
		<div className="petCardSkeleton">
			<div className="petImgContainerSkeleton">
				<div className="petImageSkeleton"></div>
			</div>
			<div className="petNameSkeleton">
				<div className="skeletonTextName"></div>
			</div>
			<div className="petDetailsSkeleton">
				<div className="petInfoSkeleton">
					<div className="skeletonText"></div>
				</div>
				<div className="petInfoSkeleton">
					<div className="skeletonText"></div>
				</div>
				<div className="petInfoSkeleton">
					<div className="skeletonText"></div>
				</div>
			</div>
		</div>
	);
}

export default PetCardSkeleton;
