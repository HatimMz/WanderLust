const mongoose = require("mongoose");
const {data} = require("./data.js")
const Listing = require("../models/listings/listing.js")

const reqData = data[2];

async function main() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
    const newListing = new Listing(reqData);
    await newListing.save();
    console.log("Listing saved successfully");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    mongoose.connection.close(); 
  }
}

main();


