const express = require('express');
const cors = require('cors');
const cookie = require('cookie-parser');
const cloudinaryConnect = require('./config/cloudinary');
const dbConnect = require('./config/database');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const user = require('./routes/auth'); 

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use('/user', user);
app.use(cors());

app.listen(PORT, () => {
    console.log(`listen on port ${PORT}`);
});

app.get('/', (req,res) => {
    res.send("Home");
})

cloudinaryConnect();
dbConnect();