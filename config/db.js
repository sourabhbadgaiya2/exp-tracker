const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log(`db is connected`);
  })
  .catch((error) => {
    console.log(error.message);
  });
