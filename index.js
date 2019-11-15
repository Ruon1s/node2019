'use strict';

require('dotenv').config();

console.log('my app');
const express = require('express');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

const app = express();

app.use(express.static('public'));

app.get('/animal', (req, res) => {
    connection.query(
        'SELECT * FROM animal',
        (err, results, fields) => {
            console.log(results);
            console.log(fields);
            res.json(results);

        }
    );
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/demo', (req, res) => {
    console.log('request', req);
    res.send('demo');
});

app.listen(3000);