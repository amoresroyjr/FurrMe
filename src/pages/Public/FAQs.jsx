import React from "react";
import "../../styles/Public/FAQs.css";
import Navbar from "../../components/Navbar";

function FAQs() {
	return (
		<div>
			<Navbar user={window.localStorage.getItem("loggedUser")} />
			<div className="FAQs-page">
				<div className="header">
					<h1>Frequently Asked Questions</h1>
					<p className="headerDescription">
						Explore our FAQs page to find answers to common questions about the
						pet adoption process and education. We're here to help make your
						journey to finding your perfect furry companion as smooth as
						possible.
					</p>
				</div>
				<div className="list">
					<ul>
						<li>
							<h2>What is the process for the Pet Adoption?</h2>
							<p>
								We have made a brief guide on the pet adoption process, you can
								read it here
							</p>
						</li>
						<li>
							<h2>How can I get started as a Furr parent?</h2>
							<p>
								You can first assess your self if you are currently capable of
								being one, being a Furr parent might sound exciting but it also
								includes a lot of responsibility which might be overwhelming for
								some. You can read educational guides about having a pet and pet
								adoption here
							</p>
						</li>
						<li>
							<h2>
								I am in lack of capability to continue supporting my current
								pet, can I have you guys take care of it for the mean time or
								completely put it in your care?
							</h2>
							<p>
								We can help you find a new family for your pet through our
								platform but unfortunately, we cannot take any animals to our
								shelter that is currently in an established care
							</p>
						</li>
						<li>
							<h2>Where can I interact with other Furr parents?</h2>
							<p>
								We have our own community page for other Furr parents to
								interact with each other. You can start sharing your Furry
								journey here
							</p>
						</li>
						<li>
							<h2>What are the requirements for adopting a pet?</h2>
							<p>
								Personal information such as a Valid ID, Contact Number, Email
								Address and Current Address. You must also read our Terms and
								Conditions Policy for an assessment whether you are suitable for
								pet adoption or not
							</p>
						</li>
					</ul>
					<p className="closing">
						We hope this resource has provided clarity and guidance on your pet
						adoption journey. If you have any further questions or need
						assistance, don't hesitate to reach out through our quick-links
						found within the page. Together, let's find loving homes for every
						pet in need.
					</p>
				</div>
			</div>
		</div>
	);
}

export default FAQs;
