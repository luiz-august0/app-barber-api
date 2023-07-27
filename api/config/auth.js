require('dotenv').config({path: __dirname+'/./../../.env'}););

export default {
    secret: process.env.SYS_SECRET,
    expiresIn: "365d"
}