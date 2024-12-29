const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const review = require("./routes/review.js");


const app = express();
const port = 8080;


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main() .then((res) => {
    console.log("Connected to DB");
}) .catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs' , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));


app.use("/listings" , listings);
app.use("/listing/:id/reviews" , review);

// for wrong req -- page not found

app.all("*", (req ,res , next) => {
  next(new ExpressError(404 , "Page Not Found!"));
});

//middle ware for handling the error which will come from the database..

app.use((err,req,res,next) => {
  let{statusCode= 500 , message = "Something went wrong"} = err;
  res.status(statusCode).render("listings/error.ejs" , {message}); 
  // res.status(statusCode).send(message);
});   


// Default route
app.get("/", (req, res) => {
  res.send("working");
});



// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port: ${port}`);
});