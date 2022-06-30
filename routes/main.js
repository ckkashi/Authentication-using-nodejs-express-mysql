const express = require('express');
const router = express.Router();
const authRoute = require('./auth');

router.use('/user',authRoute);


module.exports = router;