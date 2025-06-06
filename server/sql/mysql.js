require("dotenv").config();
const mysql = require("mysql2");

/*const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "furrme",
	multipleStatements: true,
});*/

/*const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
	multipleStatements: true,
});*/

const fs = require("fs");

const db = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT,
	multipleStatements: true,
	ssl: {
		ca: fs.readFileSync(__dirname + "/ca.pem"),
	},
});

module.exports = db;
