require('dotenv').config({path: __dirname+'/./../../.env'}););

export default {
	host: process.env.REDIS_HOST,
	port: process.env.REDIS_PORT
};