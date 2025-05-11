import React from "react";
import "../../styles/Public/Resources.css";
import Navbar from "../../components/Navbar";
import { FaArrowRight } from "react-icons/fa6";
import { MdOutlineAccountCircle } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import { IoDocumentSharp } from "react-icons/io5";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { PiPawPrint } from "react-icons/pi";

function Resources() {
	const handleReadMoreClick = (url) => {
		window.open(url, "_blank");
	};

	return (
		<div>
			<Navbar user={window.localStorage.getItem("loggedUser")} />
			<div className="resourcesPage">
				<div className="resourcesSection petCareGuides">
					<div className="Header">
						<h1 className="sectionHeader">Pet Care Guides</h1>
						<p className="sectionDescription">
							Informative guides on topics like feeding, grooming, training, and
							healthcare for cats and dogs.
						</p>
					</div>
					<div className="sectionCards">
						<div className="cardComp">
							<h3 className="cardHeader">General Pet Care</h3>
							<p className="cardHeaderTag">
								Essential guidance for ensuring the well-being and happiness of
								your beloved pets through responsible care practices.
							</p>
							<p className="cardDescription">
								As a pet parent you want to do everything you can to care for
								your pet; this involves regular, everyday activities to ensure
								they stay happy and healthy.
							</p>
							<p
								className="readMore"
								onClick={() =>
									handleReadMoreClick(
										"https://www.hillspet.com.ph/pet-care/routine-care/10-responsible-pet-care-tips"
									)
								}
							>
								Read More <FaArrowRight />
							</p>
						</div>
						<div className="cardComp">
							<h3 className="cardHeader">Proper Cat Care</h3>
							<p className="cardHeaderTag">
								Discover practical tips to ensure your cat's health and
								happiness with proper care.
							</p>
							<p className="cardDescription">
								A cat’s purr is one of the most satisfying sounds you can hear.
								A happy cat is a healthy cat. Use the following advice to keep
								your cat purring all day long.
							</p>
							<p
								className="readMore"
								onClick={() =>
									handleReadMoreClick(
										"https://nufooz.com/read-this-advice-about-proper-cat-care/?gad_source=1"
									)
								}
							>
								Read More <FaArrowRight />
							</p>
						</div>
						<div className="cardComp">
							<h3 className="cardHeader">Proper Care for Dogs</h3>
							<p className="cardHeaderTag">
								Explore essential tips for ensuring your dog's well-being and
								happiness through proper care practices.
							</p>
							<p className="cardDescription">
								Adding a dog to your home is wonderful, but prioritize your
								pet's health and happiness, whether you're experienced or new to
								pet ownership.
							</p>
							<p
								className="readMore"
								onClick={() =>
									handleReadMoreClick(
										"https://www.aspca.org/pet-care/dog-care/general-dog-care"
									)
								}
							>
								Read More <FaArrowRight />
							</p>
						</div>
					</div>
				</div>
				<div className="resourcesSection petAdoptionEducation">
					<div className="header">
						<h1 className="sectionHeader">Pet Adoption Education</h1>
						<p className="sectionDescription">
							Explore comprehensive resources on pet adoption education to make
							informed decisions and provide loving homes for animals in need.
							From understanding the adoption process to learning about
							responsible pet ownership, empower yourself with knowledge to
							create lifelong bonds with your new furry friend.
						</p>
					</div>
					<div className="sectionCards">
						<div className="cardComp">
							<h3 className="cardHeader">Responsible Pet Adoption</h3>
							<p className="cardHeaderTag">
								Find key guidelines for responsible pet adoption, ensuring a
								happy and healthy start for you and your new furry friend.
							</p>
							<p className="cardDescription">
								If you're considering bringing home a new furry friend, you may
								want to take into account some factors before you decide to
								adopt your new pet.
							</p>
							<p
								className="readMore"
								onClick={() =>
									handleReadMoreClick(
										"https://www.statefarm.com/simple-insights/family/pet-adoption"
									)
								}
							>
								Read More <FaArrowRight />
							</p>
						</div>
						<div className="cardComp">
							<h3 className="cardHeader">
								A Comprehensive Guide to Dog Breeds
							</h3>
							<p className="cardHeaderTag">
								Comprehensive guide to various dog breeds, helping you find the
								perfect match for your lifestyle and preferences.
							</p>
							<p className="cardDescription">
								Over 300 Dog Breeds recognized worldwide, with most breeds
								falling into one of 7 breed groups. Learn about the
								characteristics and behaviors of your dog's breed and group.
							</p>
							<p
								className="readMore"
								onClick={() =>
									handleReadMoreClick(
										"https://www.thesprucepets.com/dog-breeds-4162141"
									)
								}
							>
								Read More <FaArrowRight />
							</p>
						</div>
						<div className="cardComp">
							<h3 className="cardHeader">A Complete Guide on Cat Breeds</h3>
							<p className="cardHeaderTag">
								Explore a detailed guide to cat breeds, offering insights to
								assist you in finding the ideal Cat companion suited to your
								lifestyle and preferences.
							</p>
							<p className="cardDescription">
								Today there are more than 100 cat breeds, both natural and
								man-made. Use this guide to explore cat breeds by physical
								traits, personality, and more.
							</p>
							<p
								className="readMore"
								onClick={() =>
									handleReadMoreClick(
										"https://www.litter-robot.com/blog/breeds-of-cats/"
									)
								}
							>
								Read More <FaArrowRight />
							</p>
						</div>
					</div>
				</div>
				<div className="petAdoptionProcess">
					<h1 className="header">Pet Adoption Process</h1>
					<p className="headerDescription">
						Discover your new furry friend through our simple and
						straightforward adoption process.
					</p>
					<div className="cardsList">
						<div className="cards">
							<MdOutlineAccountCircle className="cardIcon" />
							<h3>Create a FurrMe Account</h3>
							<p>
								Begin your journey towards finding your perfect furry companion
								by creating a FurrMe account.
							</p>
						</div>
						<div className="cards">
							<IoSearch className="cardIcon" />
							<h3>Choose Your Desired Pet</h3>
							<p>
								Browse through our website's selection of dogs and cats waiting
								for their forever homes.
							</p>
						</div>
						<div className="cards">
							<IoDocumentSharp className="cardIcon" />
							<h3>Read Our Terms and Conditions Policy</h3>
							<p>
								Take a moment to review our Terms and Conditions Policy before
								proceeding with the adoption process.
							</p>
						</div>
						<div className="cards">
							<IoIosInformationCircleOutline className="cardIcon" />
							<h3>Provide Required Information</h3>
							<p>
								Complete the adoption application by providing the necessary
								information to ensure our pets are placed in loving and
								responsible homes.
							</p>
						</div>
						<div className="cards">
							<MdOutlineMarkEmailUnread className="cardIcon" />
							<h3>Check Your Email for Adoption Confirmation</h3>
							<p>
								Keep an eye on your email inbox for the pet adoption
								confirmation, including next steps and pickup instructions.
							</p>
						</div>
						<div className="cards">
							<PiPawPrint className="cardIcon" />
							<h3>Pick Up Your New Furr Companion</h3>
							<p>
								Visit our Pet Center at the scheduled time to meet your new
								furry friend and complete the final adoption process.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Resources;
