import React, { useState, useEffect } from "react";
import "../../styles/User/Community.css";
import Navbar from "../../components/Navbar";
import { LuUpload } from "react-icons/lu";
import { IoCloseCircleOutline } from "react-icons/io5";
import CommunityPostCard from "../../components/CommunityPostCard";
import CommunityPostCardSkeleton from "../../components/CommunityPostCardSkeleton";
import axios from "axios";
import { useSelector } from "react-redux";
import CountDownModal from "../../components/CountdownModal";
import CONFIG from "../../data/config";
import shibaLoading from "../../assets/shibaloading.gif";

function Community() {
	const [postContent, setPostContent] = useState("");
	const [uploadedImg, setUploadedImg] = useState("");
	const [showCreatePostBtn, setShowCreatePostBtn] = useState(false);
	const [postList, setPostList] = useState([]);
	const getData = useSelector((state) => state.value);
	const user = getData.user;
	const token = getData.token;
	const [refreshKey, setRefreshKey] = useState(0);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [loadError, setLoadError] = useState(false);
	const [modalContents, setModalContents] = useState({
		title: "",
		contents: "",
	});

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	useEffect(() => {
		const handleClickOutside = (e) => {
			const modalContent = document.querySelector(".modal-content");
			if (isModalOpen && modalContent && !modalContent.contains(e.target)) {
				toggleModal();
			}
		};

		if (isModalOpen) {
			document.addEventListener("click", handleClickOutside);
		} else {
			document.removeEventListener("click", handleClickOutside);
		}

		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [isModalOpen]);

	useEffect(() => {
		let timeout = setTimeout(() => {
			if (postList.length === 0) {
				setLoadError(true);
			}
		}, 10000);

		axios
			.get(`${CONFIG.BASE_URL}/community`, {
				headers: { token },
			})
			.then((res) => {
				if (res.data[0]) {
					setPostList(res.data);
					setLoadError(false); // reset if posts are fetched
				} else {
					setPostList([]);
				}
			})
			.catch((err) => {
				console.log(err);
				setLoadError(true);
			})
			.finally(() => {
				clearTimeout(timeout); // clear timeout if fetch finishes
			});

		return () => clearTimeout(timeout);
	}, [refreshKey]);

	const refreshComponent = () => {
		setRefreshKey((prevKey) => prevKey + 1);
	};

	const handleRemoveImage = () => {
		setUploadedImg(null);
		setShowCreatePostBtn(false);
	};

	const handleChange = (event) => {
		const textareaLineHeight = 24;
		const minRows = 3;
		event.target.rows = minRows;
		const currentRows = Math.floor(
			event.target.scrollHeight / textareaLineHeight
		);
		event.target.rows = currentRows;

		const newText = event.target.value;
		setPostContent(newText);
		setShowCreatePostBtn(!!uploadedImg);
	};

	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setUploadedImg(reader.result);
				setShowCreatePostBtn(!!reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleCreatePost = async (e) => {
		e.preventDefault();
		if (!uploadedImg) {
			setUploadedImg(null);
			setShowCreatePostBtn(postContent.trim().length > 0);
		}

		setUploading(true);
		try {
			const res = await axios.post(`${CONFIG.BASE_URL}/upload`, {
				image_url: uploadedImg,
			});

			await axios
				.post(
					`${CONFIG.BASE_URL}/addpost`,
					{
						image: res.data,
						description: postContent,
						email: user.email,
					},
					{ headers: { token } }
				)
				.then((res) => {
					res.data[0] ? setPostList(res.data) : setPostList([]);
					refreshComponent();

					if (res.data.message) {
						setModalContents({ title: res.data.message });
					} else {
						setModalContents({ title: "Upload Successful" });
					}
					setIsModalOpen(true);
					setShowCreatePostBtn(false);
				})
				.catch((err) => {
					console.error(err);
					setModalContents({
						title: "Post Creation Failed",
						contents:
							"There was a problem creating your post. Please try again.",
					});
					setIsModalOpen(true);
				});
		} catch (err) {
			console.error(err);
			setModalContents({
				title: "Image Upload Failed",
				contents: "There was a problem uploading the image. Please try again.",
			});
			setIsModalOpen(true);
		}
		setUploading(false);
		setUploadedImg(null);
		setPostContent("");
		setShowCreatePostBtn(false);
	};

	const handleDeleteFromList = (postId) => {
		setPostList((prevList) =>
			prevList.filter((post) => post.post_id !== postId)
		);
	};

	return (
		<>
			<CountDownModal
				isOpen={isModalOpen}
				onClose={toggleModal}
				title={modalContents.title}
			>
				<p>{modalContents.contents}</p>
			</CountDownModal>

			<div>
				<Navbar />
				<div className="communityPosts">
					<div className="createPostContainer">
						<h2>Create Post</h2>
						<div className="createPostInputs">
							<div className="userAvatar">
								<img src={user.image} alt={user.fname} />
							</div>
							<textarea
								id="postContent"
								value={postContent}
								onChange={handleChange}
								placeholder={`Share us your Furry journey!`}
							/>
							<label htmlFor="uploadImg" className="uploadImgBtn">
								<LuUpload />
								<span className="uploadText">Upload</span>
							</label>
							<input
								type="file"
								id="uploadImg"
								accept=".jpg,.jpeg,.png"
								style={{ display: "none" }}
								onChange={handleImageUpload}
							/>
						</div>

						<div className="uploadedImgContainer">
							{uploadedImg && (
								<>
									<IoCloseCircleOutline
										className="removeImgBtn"
										onClick={handleRemoveImage}
									/>
									<img src={uploadedImg} alt="uploadedimg" />
								</>
							)}
						</div>

						{showCreatePostBtn && (
							<button className="createPostBtn" onClick={handleCreatePost}>
								Create Post
							</button>
						)}
					</div>
					<div className="postsContainer">
						{loadError ? (
							<h1 className="errorMessage">Posts can't be loaded this time.</h1>
						) : postList.length === 0 ? (
							[...Array(5)].map((_, i) => <CommunityPostCardSkeleton key={i} />)
						) : (
							postList.map((post, i) => (
								<CommunityPostCard
									key={i}
									userAvatar={post.image}
									post_id={post.post_id}
									accountName={`${post.fname} ${post.lname}`}
									email={post.email}
									postImage={post.post_image}
									postContent={post.description}
									timePosted={post.posted_at}
									onDeleteSuccess={() => handleDeleteFromList(post.post_id)}
								/>
							))
						)}
					</div>
				</div>
			</div>

			{uploading && (
				<div className="loadingOverlay">
					<img src={shibaLoading} alt="loading" className="loadingImage" />
					<p>Posting . . . </p>
				</div>
			)}
		</>
	);
}

export default Community;
