import React from "react";
import "../../styles/Public/TermsAndConditions.css";
import Navbar from "../../components/Navbar";
//import Footer from "../../components/Footer";

function TermsAndConditions() {
	return (
		<div>
			<Navbar user={window.localStorage.getItem("loggedUser")} />
			<div className="termsAndConditionsPage">
				<div className="header">
					<h1>Terms and Conditions</h1>
					<p className="headerDescription">
						Welcome to FurrMe! By using our website and participating in the pet
						adoption process, you agree to the following terms and conditions:
					</p>
				</div>
				<div className="list">
					<ul>
						<li>
							<h2>1. Provide a Safe and Loving Home:</h2>
							<p>
								You agree to provide a safe, nurturing environment for the
								adopted pet, ensuring their physical and emotional well-being.
								This includes providing proper shelter, nutrition, exercise, and
								companionship.
							</p>
						</li>
						<li>
							<h2>2. Compliance with Local Laws and Regulations:</h2>
							<p>
								You agree to abide by all applicable local laws and regulations
								regarding pet ownership, including but not limited to licensing,
								vaccination, leash laws, and zoning ordinances. It is your
								responsibility to ensure that your adopted pet is legally
								permitted in your residence and community.
							</p>
						</li>
						<li>
							<h2>3. Regular Check-ins and Home Visits:</h2>
							<p>
								You consent to periodic check-ins and home visits by
								representatives of FurrMe or the adoption agency to assess the
								pet's living conditions and ensure their continued welfare.
								These visits may include verifying compliance with adoption
								agreements, addressing any concerns, and providing support and
								guidance as needed.
							</p>
						</li>
						<li>
							<h2>4. Notification of Rehoming Needs:</h2>
							<p>
								In the event that you are no longer able to care for the adopted
								pet, you agree to notify FurrMe or the adoption agency
								immediately. This includes situations such as relocation,
								personal circumstances, or changes in health. You understand
								that the adoption agency will work with you to facilitate the
								pet's safe return or rehoming process.
							</p>
						</li>
						<li>
							<h2>5. Adoption Denial or Revocation:</h2>
							<p>
								You acknowledge that FurrMe and the adoption agency reserve the
								right to deny or revoke any adoption if the terms and conditions
								outlined herein are not met. This may include situations where
								there are concerns about the pet's welfare or suitability of the
								adoptive home, failure to comply with legal requirements, or
								misrepresentation of information during the adoption process.
							</p>
						</li>
						<li>
							<h2>6. Pet Ownership Responsibilities:</h2>
							<p>
								You accept full responsibility for the care and well-being of
								the adopted pet, including but not limited to veterinary care,
								training, socialization, and enrichment. You agree to provide
								appropriate medical attention and treatment as needed and to
								maintain regular preventative care, including vaccinations, flea
								and tick control, and heartworm prevention.
							</p>
						</li>
						<li>
							<h2>7. Updates and Communication:</h2>
							<p>
								You consent to receive communication from FurrMe or the adoption
								agency regarding your adopted pet, including updates, reminders
								for vaccinations or check-ups, and information about pet-related
								events or resources. You agree to keep your contact information
								up-to-date to facilitate communication and support.
							</p>
						</li>
						<li>
							<h2>8. Agreement Acceptance:</h2>
							<p>
								By completing the adoption process on FurrMe, you acknowledge
								that you have read, understood, and agree to abide by these
								terms and conditions. You affirm that all information provided
								during the adoption process is true and accurate to the best of
								your knowledge.
							</p>
						</li>
					</ul>
					<p className="closing">
						These terms and conditions are designed to ensure the well-being of
						the adopted pets and the satisfaction of both the adopters and the
						adoption agency. Please review them carefully before proceeding with
						the adoption process. If you have any questions or concerns, feel
						free to contact us for clarification.
					</p>
				</div>
			</div>
		</div>
	);
}

export default TermsAndConditions;
