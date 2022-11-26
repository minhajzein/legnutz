const mongoose = require('mongoose');
const db = process.env.mongoURI

module.exports = () => {
  mongoose
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => console.log(`Database Connected Succesfully`))
    .catch((err) => console.log(`Error in DB connection`));
};

