const express = require("express");
const router  = express.Router({mergeParams:true});
const wrapAsync = require("../util/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../views/middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });


router.route("/")
.get( wrapAsync (listingController.index))
 .post(
      isLoggedIn,validateListing,
      upload.single("listing[image]"),
    wrapAsync (listingController.CreateListing)
);




 // new route
   
 router.get("/new",isLoggedIn, listingController.renderNewForm);
 
router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,validateListing,
upload.single("listing[image]"),

 wrapAsync( listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync (listingController.destroyListing));

      //Edit route 
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));



module.exports = router;
