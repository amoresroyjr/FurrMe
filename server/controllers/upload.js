const cloud = require("cloudinary").v2;

cloud.config({
	api_key: process.env.api_key,
	cloud_name: process.env.cloud_name,
	api_secret: process.env.api_secret,
});

const opts = {
	overwrite: true,
	invalidate: true,
	resource_type: "auto",
};

async function upload(req, res) {
	const image_url = req.body.image_url;
	try {
		const uploadResult = await cloud.uploader
			.upload(image_url)
			.then((result) => {
				return res.json(result.secure_url);
			});
	} catch (error) {
		console.log(error);
	}
}

const uploadImage = (image) => {
	//imgage => base64
	return new Promise((resolve, reject) => {
		cloud.uploader.upload(image, opts, (error, result) => {
			if (result && result.secure_url) {
				console.log(result.secure_url);
				return resolve(result.secure_url);
			}
			console.log(error.message);
			return reject({ message: error.message });
		});
	});
};

const uploadMultipleImages = (images) => {
	return new Promise((resolve, reject) => {
		const uploads = images.map((base) => uploadImage(base));
		Promise.all(uploads)
			.then((values) => resolve(values))
			.catch((err) => reject(err));
	});
};

async function uploadMulti(req, res) {
	uploadMultipleImages(req.body.images)
		.then((urls) => res.send(urls))
		.catch((err) => res.status(500).send(err));
}

module.exports = { upload, uploadMulti };
