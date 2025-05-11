const fs = require("fs");
const path = require("path");

const initDB = (db) => {
	const queries = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
	db.query(queries, (err) => {
		if (err) console.error("Error creating tables:", err);
		else console.log("All tables ensured on server start.");
	});
};

module.exports = initDB;
