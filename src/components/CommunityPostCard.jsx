import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../styles/Components/CommunityPostCard.css";
import { useSelector } from "react-redux";
import axios from "axios";
import CONFIG from "../data/config";

function CommunityPostCard(props) {
	const [showFullText, setShowFullText] = useState(false);
	const [showOptions, setShowOptions] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [editedText, setEditedText] = useState(props.postContent || "");
	const [currentContent, setCurrentContent] = useState(props.postContent || "");

	const toggleText = () => {
		setShowFullText(!showFullText);
	};
	const dropdownRef = useRef(null);
	const getData = useSelector((state) => state.value);
	const user = getData.user;
	const token = getData.token;

	const toggleOptions = () => {
		setShowOptions(!showOptions);
	};
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowOptions(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleSaveEdit = async () => {
		const trimmedText = editedText.trim();
		try {
			const response = await axios.patch(
				`${CONFIG.BASE_URL}/updatepost/${props.post_id}`,
				{ description: trimmedText },
				{
					headers: {
						token: token,
					},
				}
			);
			setCurrentContent(trimmedText);
			setIsEditing(false);
			if (props.onUpdateSuccess) props.onUpdateSuccess(editedText);
		} catch (error) {
			console.error(
				"Error updating post:",
				error.response?.data?.message || error.message
			);
		}
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditedText(props.postContent || "");
	};

	const shouldRenderPostContent =
		props.postContent && props.postContent.trim() !== "";

	const shouldShowEllipsis = props.postContent && props.postContent.length > 50;

	const handleDeleteConfirm = async () => {
		try {
			const response = await axios.delete(
				`${CONFIG.BASE_URL}/deletepost/${props.post_id}`,
				{
					headers: {
						token: token,
					},
				}
			);
			setShowDeleteModal(false);
			props.onDeleteSuccess?.();
		} catch (error) {
			console.error(
				"Error deleting post:",
				error.response?.data?.message || error.message
			);
		}
	};

	return (
		<div className="postCard">
			<div className="postCardHeaders">
				<div className="postLeft">
					<div className="postAvatar">
						<img src={props.userAvatar} alt="Avatar" />
					</div>
					<div className="postInfo">
						<h2 className="userAccntName">{props.accountName}</h2>
						<p className="datePosted">
							{new Date(
								new Date(props.timePosted).getTime() + 8 * 60 * 60 * 1000
							).toLocaleString(undefined, {
								year: "numeric",
								month: "short",
								day: "numeric",
								hour: "numeric",
								minute: "2-digit",
								hour12: true,
							})}
						</p>
					</div>
				</div>
				<div className="postOptionsContainer" ref={dropdownRef}>
					<button className="optionsArrow" onClick={toggleOptions}>
						<i className="fa fa-ellipsis-h" aria-hidden="true"></i>
					</button>
					{showOptions && (
						<div className="optionsDropdown">
							{user.email === props.email ? (
								<>
									<button
										className="editBtn"
										onClick={() => {
											setIsEditing(true);
											setEditedText(currentContent || "");
											setShowOptions(false);
										}}
									>
										Edit
									</button>

									<button
										className="deleteBtn"
										onClick={() => {
											setShowDeleteModal(true);
											setShowOptions(false);
										}}
									>
										Delete
									</button>
								</>
							) : (
								<button className="deleteBtn" onClick={props.onDelete}>
									Report
								</button>
							)}
						</div>
					)}
				</div>
			</div>

			{shouldRenderPostContent && !isEditing ? (
				<>
					<p className="postTextDesc">
						{showFullText
							? currentContent
							: `${currentContent?.slice(0, 50)}${currentContent.length > 100 ? "... " : ""}`}
						{currentContent.length > 100 && !showFullText && (
							<span className="readMore" onClick={toggleText}>
								Read More
							</span>
						)}
					</p>
					{showFullText && (
						<span className="showLess" onClick={toggleText}>
							Show Less
						</span>
					)}
				</>
			) : (
				isEditing && (
					<textarea
						className="editTextArea"
						value={editedText}
						onChange={(e) => setEditedText(e.target.value)}
					/>
				)
			)}

			<Link to={props.postImage} target="_blank">
				<div className="comPostImg">
					<img src={props.postImage} alt="Post" />
				</div>
			</Link>
			{isEditing && (
				<div className="editButtons">
					<button className="saveBtn" onClick={handleSaveEdit}>
						Save
					</button>
					<button className="cancelBtn" onClick={handleCancelEdit}>
						Cancel
					</button>
				</div>
			)}

			{showDeleteModal && (
				<div className="modalOverlay">
					<div className="deleteModal">
						<p>Delete post?</p>
						<div className="modalButtons">
							<button className="yesBtn" onClick={handleDeleteConfirm}>
								Yes
							</button>
							<button
								className="noBtn"
								onClick={() => setShowDeleteModal(false)}
							>
								No
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default CommunityPostCard;
