const express = require("express");
const users = require("./routes/user.js");
const app = express();
const posts = require("./routes/post.js")


//users route 
// get route

app.get("/", (req, res) => {
  res.send("Hi i am root");
});

app.use("/users" , users); //jitne bhi path aaye means jo jo path haamare / se start hote hai wo sabhi users ko use kre ....

app.use("/posts" , posts);

app.listen(3000, () => {
  console.log("server is listening to 3000");
});
