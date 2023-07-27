var cloudinary = require("cloudinary").v2;
require('dotenv').config({path: __dirname+'/./../../.env'}););

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_KEY,
	api_secret: process.env.CLOUD_SECRET
})

const opts = {
	overwrite: true,
	invalidate: true,
	resource_type: "auto"
}

module.exports = (file) => {
	return new Promise((resolve, reject) => {
		cloudinary.uploader.upload(file, opts, (error, result) => {
			if (result && result.secure_url) {
				return resolve('v' + result.version + '/' +  result.public_id + '.' + result.format);
			}
			return reject({ message: error.message });
		})
	})
}