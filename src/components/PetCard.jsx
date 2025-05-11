import "../styles/Components/PetCard.css";
import { Link } from "react-router-dom";

function PetCard(pet) {
	return (
		<Link to={`/pets/${pet.data.pet_id}`} state={pet.data} className="petCard">
			<div className="petImgContainer">
				<img src={pet.data.image} alt={pet.data.name} className="petImage" />
			</div>
			<div className="petName">
				<i class="fa-solid fa-paw"></i>
				<h2>{pet.data.name}</h2>
			</div>
			<div className="petDetails">
				<div className="petInfo">
					<i class="fa-solid fa-location-dot"></i>
					<p>{pet.data.address}</p>
				</div>
				<div className="petInfo">
					<i class="fa-solid fa-birthday-cake"></i>

					<p>{pet.data.age}</p>
				</div>
				<div className="petInfo">
					{pet.data.gender === "Male" ? (
						<i className="fa-solid fa-mars"></i>
					) : (
						<i className="fa-solid fa-venus"></i>
					)}
					<p>{pet.data.gender}</p>
				</div>
			</div>
		</Link>
	);
}
export default PetCard;
