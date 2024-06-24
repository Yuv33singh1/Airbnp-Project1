const mongoose =  require("mongoose");
const review = require("./review");
 const Schema = mongoose.Schema;
 const Review = require("./review");

 const listingSchema =  new Schema({
     title:{
        type:String,
        required: true,
    }, 
     description: String,
     
     image:{
       url: String,
       filename: String,
     },
     price: Number,
     location:String,
     country:String,
     review:[
        {
            type:Schema.Types.ObjectId,
            ref: "Review",
        },
     ],
      owner: {
        type:Schema.Types.ObjectId,
        ref: "User",
     },
     geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ["Point"], // 'location.type' must be 'Point'
            required: true,
          },
          coordinates: {
            type: [Number],
            default: [75.3412, 31.1471],
            required: true,
          },
        },

    });
//listing ke sath reviews bhi delete krega yeah midddleWare
 listingSchema.post("findOneAndDelete",async(listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.review}});

    }
 });

 const Listing = mongoose.model('Listing', listingSchema);
 
 module.exports = Listing;