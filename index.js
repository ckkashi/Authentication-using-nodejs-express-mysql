const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const port = process.env.SERVER_PORT;
const db = require('./db');
const mainRoute = require('./routes/main');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(mainRoute);
// app.use(cors()); 
// app.use(bodyParser.urlencoded({extended:true}));
// app.use(bodyParser.json());   

app.listen(port,()=>{
    console.log("app is listening on port "+port);
})