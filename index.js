require('dotenv').config();
const Generator = require('./src/Generator');

new Generator().init(true)
    .catch((err) => {
      console.log(err);
    });
