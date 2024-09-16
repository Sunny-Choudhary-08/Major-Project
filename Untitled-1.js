
// // Route to test creating a new listing
// app.get("/testListing", async (req, res) => {
//   try {
//     let sampleListing = new Listing({
//       title: "My Home",
//       description: "By the beach",
//       price: 1200,
//       location: "Goa",
//       country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");

//     res.send("Successful testing");
//   } catch (error) {
//     console.error("Error saving listing:", error);
//     res.status(500).send("Error saving listing");
//   }
// });


