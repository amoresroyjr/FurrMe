const db = require("../sql/mysql");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloud = require("cloudinary").v2;
const saltRounds = 10;

cloud.config({
	api_key: process.env.api_key,
	cloud_name: process.env.cloud_name,
	api_secret: process.env.api_secret,
});

async function login(req, res) {
	const email_check = "select * from accounts where email = ?";
	const password_check = "select pass from accounts where email = ?";

	db.query(email_check, [req.body.email], (err, isThereAcc) => {
		if (!isThereAcc[0])
			return res.json({ auth: false, message: "Invalid Email or Password" });
		db.query(password_check, [req.body.email], async (err, result_pass) => {
			const result = await bcrypt.compare(
				req.body.password,
				result_pass[0].pass
			);
			if (err) throw err;
			if (result) {
				const email = isThereAcc[0].email;
				const token = jwt.sign({ email }, process.env.JWT_SECRET, {
					expiresIn: "1d",
				});
				return res
					.header("Authorization", token)
					.json({ token: token, userData: isThereAcc[0] });
			} else {
				return res.json({ message: "Invalid Email or Password" });
			}
		});
	});
}

async function register(req, res) {
	const user = req.body.formData;
	const pass = req.body.password;
	const sql =
		"INSERT into accounts(fname, lname, email, pass, image, role) VALUES (?, ?, ?, ?, ?, ?)";
	const emailQuery = "select email from accounts where email = ?";

	db.query(emailQuery, [user.email], async (err, result_email) => {
		if (!result_email[0]) {
			const hashedPassword = await bcrypt.hash(pass, saltRounds);
			db.query(
				sql,
				[
					user.fname,
					user.lname,
					user.email,
					hashedPassword,
					user.image,
					user.role,
				],
				(err, results) => {
					if (err)
						return res.json({ message: "Error Inserting data in server" });
					return res.json({ message: "Success" });
				}
			);
		} else {
			return res.json({ message: "Email already used" });
		}
	});
}

async function manageProfile(req, res) {
	const emailPayload = jwt.verify(req.body.token, process.env.JWT_SECRET);
	const accInfo = `SELECT * FROM accounts WHERE email = ?`;
	let taken = 0;
	const updates = [];
	const values = [];

	const [currentUser] = await new Promise((resolve, reject) => {
		db.query(accInfo, [req.body.prevEmail], (err, result) => {
			if (err) return reject(err);
			if (result.length === 0) return reject(new Error("User not found"));
			resolve(result);
		});
	});

	const isPasswordCorrect = await bcrypt.compare(
		req.body.pass,
		currentUser.pass
	);
	if (!isPasswordCorrect && req.body.pass != "") {
		return res.json({ message: "Incorrect Password", access: 0 });
	}

	if (req.body.newEmail && req.body.newEmail !== req.body.prevEmail) {
		const [existingEmail] = await new Promise((resolve, reject) => {
			db.query(accInfo, [req.body.newEmail], (err, result) => {
				if (err) return reject(err);
				resolve(result);
			});
		});

		if (existingEmail) {
			return res.json({ message: "Email Taken", access: 0 });
		}

		updates.push("email = ?");
		values.push(req.body.newEmail);
	}

	if (req.body.fname) {
		updates.push("fname = ?");
		values.push(req.body.fname);
	}

	if (req.body.lname) {
		updates.push("lname = ?");
		values.push(req.body.lname);
	}

	if (req.body.image) {
		updates.push("image = ?");
		values.push(req.body.image);
	}

	if (req.body.npass) {
		const newHashedPassword = await bcrypt.hash(req.body.npass, saltRounds);
		updates.push("pass = ?");
		values.push(newHashedPassword);
	}

	if (updates.length === 0) {
		return res.json({ message: "No changes made", access: 0 });
	}

	const sql = `UPDATE accounts SET ${updates.join(", ")} WHERE email = ?`;
	values.push(req.body.prevEmail);

	db.query(sql, values, (err, result) => {
		if (err) return console.log(err);

		const finalEmail = req.body.newEmail || req.body.prevEmail;
		db.query(accInfo, [finalEmail], (err, info) => {
			if (err) return console.log(err);
			const newToken = jwt.sign(emailPayload, process.env.JWT_SECRET);

			return res.json({
				userData: info[0],
				token: newToken,
				message: "Info Updated Successfully",
				access: 1,
			});
		});
	});
}

async function addPost(req, res) {
	const addpost =
		"INSERT into community(email, description, post_image) VALUES (?, ?, ?)";
	const sql = "SELECT * from community";
	const token = jwt.verify(req.headers.token, process.env.JWT_SECRET);
	if (token) {
		db.query(
			addpost,
			[req.body.email, req.body.description, req.body.image],
			(err, result) => {
				if (err) console.log(err);
				db.query(sql, (err, postList) => {
					if (err) console.log(err);
					return res.json(postList);
				});
			}
		);
	} else {
		res.json({ message: "No Access" });
	}
}

async function communityList(req, res) {
	db.query(
		`SELECT c.*, a.fname, a.lname, a.image 
		 FROM community c
		 JOIN accounts a ON c.email = a.email
		 ORDER BY c.post_id DESC`,
		(err, postList) => {
			if (err) {
				console.log(err);
			} else {
				return res.json(postList);
			}
		}
	);
}

async function deletePost(req, res) {
	const postId = req.params.post_id;
	const userEmail = req.user.email;

	db.query(
		`DELETE FROM community WHERE post_id = ? AND email = ?`,
		[postId, userEmail],
		(err, result) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ error: "Database error" });
			}
			if (result.affectedRows === 0) {
				return res
					.status(403)
					.json({ message: "Unauthorized or post not found" });
			}
			return res.status(200).json({ message: "Post deleted successfully" });
		}
	);
}

const updatePost = async (req, res) => {
	try {
		const postId = req.params.post_id;
		const token = req.headers.token || req.body.token;

		if (!token) return res.status(401).json({ message: "Unauthorized" });

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const email = decoded.email;

		const [existingPost] = await new Promise((resolve, reject) => {
			db.query(
				"SELECT * FROM community WHERE post_id = ?",
				[postId],
				(err, results) => {
					if (err) return reject(err);
					resolve(results);
				}
			);
		});

		if (!existingPost) {
			return res.status(404).json({ message: "Post not found" });
		}

		if (existingPost.email !== email) {
			return res
				.status(403)
				.json({ message: "Forbidden: Cannot edit others' posts" });
		}

		const updates = [];
		const values = [];

		if (req.body.description !== undefined) {
			updates.push("description = ?");
			values.push(req.body.description);
		}

		if (updates.length === 0) {
			return res.json({ message: "No changes made", access: 0 });
		}

		const sql = `UPDATE community SET ${updates.join(", ")} WHERE post_id = ?`;
		values.push(postId);

		db.query(sql, values, (err, result) => {
			if (err) {
				console.error(err);
				return res.status(500).json({ message: "Database error" });
			}

			return res.json({ message: "Post updated successfully", access: 1 });
		});
	} catch (error) {
		console.error("Update post error:", error);
		return res.status(500).json({ message: "Server error" });
	}
};

async function adoptionRequest(req, res) {
	const utcNow = new Date().toISOString().slice(0, 19).replace("T", " ");
	const addpost =
		"INSERT into adoptreq(pet_id, email, valid_id, address, contact, household, employment, pet_exp, requested_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
	db.query(
		addpost,
		[
			req.body.id,
			req.body.email,
			req.body.valid_id,
			req.body.address,
			req.body.contact,
			req.body.household,
			req.body.employment,
			req.body.pet_exp,
			utcNow,
		],
		(err, result) => {
			if (err) return res.json({ message: "Error Applying" }), console.log(err);
			return res.json({ message: "Adoption Application Successful!" });
		}
	);
}

async function getpetPreview(req, res) {
	db.query(
		"SELECT * FROM pets INNER JOIN pet_img ON pets.pet_id = pet_img.pet_id WHERE pets.pet_id = ?;",
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

module.exports = {
	login,
	register,
	manageProfile,
	addPost,
	communityList,
	adoptionRequest,
	getpetPreview,
	deletePost,
	updatePost,
};
