require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./sql/mysql");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const page = require("./controllers/pageController");
const user = require("./controllers/userController");
const admin = require("./controllers/adminController");
const { upload } = require("./controllers/upload");
const { verifyJWT } = require("./config/middleware");
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const initDB = require("./sql/initDB");

db.connect((err) => {
	if (err) {
		console.error("Error connecting to the database: " + err.stack);
		return;
	}
	console.log("Connected to the database");
	initDB(db);
});

app.get("/", (req, res) => res.send("Server is running"));

app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});

app.post("/upload", upload);

app.get("/pets", page.getPets);
app.get("/pets/cats", page.getCats);
app.get("/pets/dogs", page.getDogs);

app.post("/login", user.login);
app.post("/register", user.register);
app.patch("/manage", verifyJWT, user.manageProfile);
app.post("/addpost", verifyJWT, user.addPost);
app.get("/community", verifyJWT, user.communityList);
app.post("/adoptReq", verifyJWT, user.adoptionRequest);
app.get("/petPreview/:id", user.getpetPreview);
app.delete("/deletepost/:post_id", verifyJWT, user.deletePost);
app.patch("/updatepost/:post_id", verifyJWT, user.updatePost);

app.get("/admin", verifyJWT, admin.adminPetList);
app.get("/admin/petDetails/:id", verifyJWT, admin.getpetDetails);
app.get("/admin/petImage/:id", verifyJWT, admin.getpetImages);
app.get("/admin/adoptReq/:id", verifyJWT, admin.getAdoptReq);

app.get("/adoption/list", verifyJWT, admin.adoptionList);
app.post("/admin/petInfoUpdate", verifyJWT, admin.updatePetInfo);
app.post("/admin/evaluation/accDetails", verifyJWT, admin.accDetails);

app.post("/admin/create", async (req, res) => {
	try {
		const creator = jwt.verify(req.body.token, process.env.JWT_SECRET);
		const petInfo = req.body.data;
		const images = req.body.images;

		const insertPetQuery = `
			INSERT INTO pets (name, category, address, description, color, gender, image, breed, age, behavior, health, status, createdBy, adoptedBy)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`;

		db.query(
			insertPetQuery,
			[
				petInfo.name,
				req.body.type,
				petInfo.address,
				petInfo.description,
				petInfo.color,
				req.body.gender,
				images[0],
				petInfo.breed,
				petInfo.age,
				petInfo.behavior,
				petInfo.health,
				"Available",
				creator.email,
				null,
			],
			(err, result) => {
				if (err) {
					console.error("Error inserting pet:", err);
					return res
						.status(500)
						.json({ success: false, message: "Database error on insert" });
				}

				const newPetId = result.insertId;

				const imgQuery = `
					INSERT INTO pet_img (pet_id, img1, img2, img3, img4, img5)
					VALUES (?, ?, ?, ?, ?, ?)
				`;

				db.query(
					imgQuery,
					[newPetId, images[0], images[1], images[2], images[3], images[4]],
					(err, resImg) => {
						if (err) {
							console.error("Error inserting images:", err);
							return res
								.status(500)
								.json({ success: false, message: "Database error on images" });
						}

						return res.json({
							success: true,
							message: "Pet listing created successfully",
							newpet_id: newPetId,
						});
					}
				);
			}
		);
	} catch (error) {
		console.error("JWT error or other failure:", error);
		res
			.status(401)
			.json({ success: false, message: "Unauthorized or invalid request" });
	}
});

app.post("/admin/evaluation/pet", (req, res) => {
	db.query(
		"select * from pets where pet_id = ?",
		[req.body.id],
		(err, petInfo) => {
			if (err) {
				console.log(err);
			}
			return res.json(petInfo);
		}
	);
});

app.post("/admin/setStatus", (req, res) => {
	const { status, pet_id, email, request_id, reason } = req.body;

	if (status === "Approved") {
		const approveQuery = `
			UPDATE adoptreq SET status = 'Approved', reason = NULL
			WHERE request_id = ?
		`;
		const rejectOthersQuery = `
			UPDATE adoptreq 
			SET status = 'Rejected', 
				reason = CASE 
							WHEN reason IS NULL OR reason = '' THEN 'Another applicant was approved' 
							ELSE reason 
						END
			WHERE pet_id = ? AND request_id != ?
		`;
		const updatePetQuery = `
			UPDATE pets SET adoptedBy = ?, status = 'Adopted'
			WHERE pet_id = ?
		`;

		db.query(approveQuery, [request_id], (err) => {
			if (err) return res.status(500).json({ error: err });

			db.query(rejectOthersQuery, [pet_id, request_id], (err) => {
				if (err) return res.status(500).json({ error: err });

				db.query(updatePetQuery, [email, pet_id], (err) => {
					if (err) return res.status(500).json({ error: err });

					return res.json({ Status: "Approved Successfully!" });
				});
			});
		});
	} else if (status === "Rejected") {
		const rejectQuery = `
			UPDATE adoptreq SET status = 'Rejected', reason = ?
			WHERE request_id = ?
		`;

		db.query(rejectQuery, [reason || null, request_id], (err) => {
			if (err) return res.status(500).json({ error: err });

			return res.json({ Status: "Rejected Successfully!" });
		});
	} else {
		return res.status(400).json({ error: "Invalid status." });
	}
});

app.post("/emailValidate", (req, res) => {
	db.query("select email from accounts;", (err, list) => {
		if (err) {
			console.log(err);
		} else {
			return res.json(list);
		}
	});
});

app.use((err, req, res, next) => {
	console.error("Unhandled error:", err.stack);
	res.status(500).send("Something went wrong!");
});

module.exports = app;
