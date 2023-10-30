const mongoose = require('mongoose');
require('dotenv').config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
    })
    .then(() => console.log('Db connect successfully'))
    .catch((err) => console.log(err));
}

module.exports = dbConnect;