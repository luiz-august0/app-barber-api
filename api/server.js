import app from "./app";
require('dotenv').config({path: __dirname+'/./../../.env'}););

app.listen(process.env.PORT || 5000);