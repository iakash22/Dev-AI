const express = require('express');
const {removeLike,addLike} = require('../controllers/like');
const {auth} = require('../middlewares/auth');

const router = express();

router.put('/add-like', auth,addLike);
router.put('/remove-like', auth,removeLike);

module.exports = router;