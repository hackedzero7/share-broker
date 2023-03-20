/**import pakages or file paths */

const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const ErrorMiddleware = require('./middleware/Error');
const user = require('./routes/user');
const stock = require('./routes/stock');
const wallet = require('./routes/wallet');
const purchase = require('./routes/purchase');
const selling = require('./routes/selling');
const app = express();


/**configuration evironment setup */
dotenv.config({
    path:'./config/config.env'
})

/**Middleware */
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods:["GET", "POST", "PUT", "DELETE"]
}))

/**Api routes Initiall paths */
app.use('/api/v1', user);
app.use('/api/v1', stock);
app.use('/api/v1', wallet);
app.use('/api/v1', purchase);
app.use('/api/v1', selling);

module.exports = app;

/**Error Handling Middleware */

app.use(ErrorMiddleware);