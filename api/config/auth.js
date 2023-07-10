require('dotenv').config();

export default {
    secret: process.env.SYS_SECRET,
    expiresIn: "7d"
}