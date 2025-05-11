import "../styles/Components/CommunityPostCardSkeleton.css";

function CommunityPostCardSkeleton() {
	return (
		<div className="communityPostCardSkeleton">
			<div className="postCardHeaders">
				<div className="skeleton-avatar"></div>
				<div className="postTextDescription">
					<div className="skeleton-text"></div>
					<div className="skeleton-text"></div>
				</div>
			</div>
			<div className="skeleton-text"></div>
			<div className="skeleton-img"></div>
		</div>
	);
}

export default CommunityPostCardSkeleton;
