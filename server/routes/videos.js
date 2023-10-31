const express = require('express');
const {
        addVideo,
        getAllVideos,
        getCategoryBaseVideos,
        getTagBasedVideos,
    } = require('../controllers/videos');
const {createCategory,showAllCategories} = require('../controllers/category');
const {auth} = require('../middlewares/auth');

const router = express();

router.post('/add-video',auth,addVideo);
router.get('/get-category-videos', getCategoryBaseVideos);
router.get('/get-tag-videos', getTagBasedVideos);
router.get('/get-videos', getAllVideos);


router.post("/createCategory", auth, createCategory);
router.get("/showAllCategories", showAllCategories);

module.exports = router;