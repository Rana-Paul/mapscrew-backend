const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.83ag0hz.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    console.log(`connected`);
  })
  .catch((err) => {
    console.log(err);
  });