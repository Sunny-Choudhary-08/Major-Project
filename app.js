//new 

const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // Adjust this path based on your directory structure
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");



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





//joi schema middleware

const validatereview = (req, res, next) => {
  
  let {error} = reviewSchema.validate(req.body);
  if(error) {
    let errorMessage = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400 , error.message);
  } else {
    next();
  }
}

app.use("/listings" , listings);

//reviews route

app.post("/listings/:id/reviews" , validatereview , wrapAsync(async (req,res) => {
  let listing =  await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();
  
  res.redirect(`/listings/${listing._id}`);

}));


app.delete("/listings/:id/reviews/:reviewId" , wrapAsync(async(req,res) => {
  let { id , reviewId } =  req.params;
  await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId}})
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
}))

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