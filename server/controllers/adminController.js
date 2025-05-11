const db = require("../sql/mysql");

async function adminPetList(req, res) {
	db.query(
		"select * from pets inner join pet_img on pets.pet_id = pet_img.pet_id",
		(err, petList) => {
			if (err) {
				console.log(err);
			} else {
				return res.json(petList);
			}
		}
	);
}

async function getpetDetails(req, res) {
	db.query(
		"select * from pets where pet_id = ?",
		req.params["id"],
		(err, pets) => {
			if (err) {
				console.log(err);
			} else {
				return res.json(pets[0]);
			}
		}
	);
}

async function getpetImages(req, res) {
	db.query(
		"select img1,img2,img3,img4,img5 from pet_img where pet_id = ?",
		req.params["id"],
		(err, pets) => {
			if (err) {
				console.log(err);
			} else {
				return res.json(pets[0]);
			}
		}
	);
}

async function updatePetInfo(req, res) {
	const pet = req.body.info;
	const img = req.body.images;

	const infoQuery = `UPDATE pets set name = ?, description = ?, color = ?, age = ?, behavior = ?, health = ? where pet_id = ?`;
	const imgQuery = `UPDATE pet_img set img1 = ?, img2 = ?, img3 = ?, img4 = ?, img5 = ? where pet_id=?`;
	db.query(
		infoQuery,
		[
			pet.name,
			pet.description,
			pet.color,
			pet.age,
			pet.behavior,
			pet.health,
			pet.pet_id,
		],
		(err, result) => {
			if (result.warningCount === 0) {
				db.query(
					imgQuery,
					[img[0], img[1], img[2], img[3], img[4], pet.pet_id],
					(err, result) => {
						return res.json(result.warningCount);
					}
				);
			}
		}
	);
}

async function adoptionList(req, res) {
	db.query(
		`SELECT adoptreq.*, pets.name AS pet_name, pets.category 
		 FROM adoptreq 
		 JOIN pets ON adoptreq.pet_id = pets.pet_id`,
		(err, petList) => {
			if (err) {
				console.log(err);
				return res
					.status(500)
					.json({ error: "Failed to fetch adoption requests." });
			} else {
				return res.json(petList);
			}
		}
	);
}

async function accDetails(req, res) {
	db.query(
		"select * from accounts where email = ?",
		[req.body.email],
		(err, accInfo) => {
			if (err) {
				console.log(err);
			}
			return res.json(accInfo);
		}
	);
}

async function getAdoptReq(req, res) {
	db.query(
		"select * from adoptreq where request_id = ?",
		[req.params.id],
		(err, reqInfo) => {
			if (err) {
				console.log(err);
			} else {
				return res.json(reqInfo[0]);
			}
		}
	);
}

module.exports = {
	adminPetList,
	getpetDetails,
	getpetImages,
	updatePetInfo,
	adoptionList,
	accDetails,
	getAdoptReq,
};
