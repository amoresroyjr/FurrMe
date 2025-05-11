const db = require("../sql/mysql");

async function getPets(req, res) {
	db.query(
		"SELECT * FROM pets INNER JOIN pet_img ON pets.pet_id=pet_img.pet_id where status = 'Available' || status = 'Pending';",
		(err, petList) => {
			if (err) {
				console.log(err);
			} else {
				return res.json(petList);
			}
		}
	);
}

async function getCats(req, res) {
	db.query(
		"select * from pets INNER JOIN pet_img ON pets.pet_id=pet_img.pet_id where category = 'cats' && status = 'Available'",
		(err, catList) => {
			if (err) {
				console.log(err);
			} else {
				return res.json(catList);
			}
		}
	);
}

async function getDogs(req, res) {
	db.query(
		"select * from pets INNER JOIN pet_img ON pets.pet_id=pet_img.pet_id where category = 'dogs' && status = 'Available'",
		(err, dogList) => {
			if (err) {
				console.log(err);
			} else {
				return res.json(dogList);
			}
		}
	);
}

module.exports = {
	getPets,
	getDogs,
	getCats,
};
