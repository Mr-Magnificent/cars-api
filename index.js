const express = require('express');
const app = express();

const debug = require('debug')('app:');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const PORT = process.env.PORT || 3000;
require('./app/config/database');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());


app.listen(PORT, () => {
    debug(`server started at port ${PORT}`);
});
