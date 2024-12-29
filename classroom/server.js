const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

//sending cookies

app.get("/getCookies", (req, res) => {
  res.cookie("Greet", "Hello");
  res.cookie("MadeIn", "Namaste");
  res.send("Send you some Cookies!");
});

//parse cookies

app.get("/", (req, res) => {
  console.log(req.cookies);
  res.send("Hi i am root");
});

app.listen(3000, () => {
  console.log("server is listening to 3000");
});
