//new 

const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // Adjust this path based on your directory structure
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");




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




//Index Route
app.get("/listings", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route which will print the individual data of every listing

app.get("/listings/:id" , wrapAsync(async(req ,res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs" , {listing});
}));

//create route to add new listing 

app.post("/listings" , wrapAsync(async(req,res ,next) => {

  if(!req.body.listing) {
    throw new ExpressError(400 , "Send valid data for listing");
  }
  const newListing =  new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

}));

//edit route 

app.get("/listings/:id/edit" , wrapAsync(async(req ,res) => {
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs" , {listing});
}));

// update route to save edit route data

app.put("/listings/:id" , wrapAsync(async(req,res) => {
  let {id} =req.params;
  await Listing.findByIdAndUpdate(id , {...req.body.listing});
  res.redirect(`/listings/${id}`);
}));

//Delete route 

app.delete("/listings/:id" , wrapAsync(async (req,res) => {
  let {id} = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));


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