const express = require('express');
const app = express();
const static = express.static(__dirname + '/public');
const configRoutes = require('./routes');

require('dotenv').config()

const fs = require('fs');

global.__basedir = __dirname;
/*
const firebase = require('./utils/firebase');
global.__basedir = __dirname;

// check images folder
fs.exists('./images', (e) => {
	if (!e) fs.mkdirSync('./images');
});
*/
app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3006;

configRoutes(app);

app.listen(port, () => {
	console.log("We've now got a server!");
	console.log(`Your routes will be running on http://localhost:${port}`);
});