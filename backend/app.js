// configure express and middlewares
// import packages
// create expess app
// configure middlewares
// export the app

const express = require('express');
const cors = require('cors');
const auth = require('./routes/auth');
const app = express();  
app.use(cors());
app.use(express.json());
app.use('/api/v1/users', auth);

module.exports = app;