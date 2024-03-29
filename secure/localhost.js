'use strict';
const https = require('https');
const fs = require('fs');
const http = require('http');

const options = {
    key: fs.readFileSync('../ca.key'),
    cert: fs.readFileSync('../ca.crt')
};


module.exports = (app) => {
https.createServer(options, app).listen(8000);

http.createServer((req, res) => {
        res.writeHead(301, {'location' : 'https://localhost:8000' + req.url });
        res.end();
    }

).listen(3000);
};