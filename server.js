require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const routes = require('./ServerModules/routes');

const app = express();

app.use(cors());

app.use(bodyParser.json()); // Configures bodyParser to accept JSON
app.use(bodyParser.urlencoded({
    extended: false
}));

const connection = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'fintrack'
});
connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
    routes(app, connection);
    app.listen(3000);
});