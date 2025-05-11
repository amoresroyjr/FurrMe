const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
	const token = req.headers.token || req.body.token;

	if (!token)
		return res.status(401).json({ auth: false, message: "No token provided." });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(403).json({ auth: false, message: "Invalid token." });
	}
};

module.exports = { verifyJWT };
