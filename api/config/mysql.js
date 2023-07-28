import * as mysql from 'mysql2';
require('dotenv').config();

var pool = mysql.createPool({
    "user" : process.env.USUARIO,
    "password" : process.env.PASSWORD,
    "database" : process.env.DATABASE,
    "host" : process.env.HOST,
    "port" : process.env.PORTBASE
})

exports.pool = pool;