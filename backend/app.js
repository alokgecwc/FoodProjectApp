// configure express and middlewares
// import packages
// create expess app
// configure middlewares
// export the app

const express = require('express');
const cors = require('cors');

const app = express();  
app.use(cors());
app.use(express.json());


module.exports = app;