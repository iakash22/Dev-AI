const express = require('express');
const {signup,sendotp,login} = require('../controllers/auth');

const router = express();

router.post('/singup', signup);
router.post('/login', login);
router.post('/sendOtp', sendotp);

module.exports = router;