const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
const cloudinary = require("cloudinary").v2;


module.exports.index = async (req, res) => {
    const { category } = req.query;
    let filter = {};
    if (category) {
        filter.category = category;
    }
    const allListings = await Listing.find(filter);
    res.render("listing/index", { allListings, activeCategory: category || null });
};

module.exports.new = (req,res) => {
    res.render("listing/new");
};

module.exports.show = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"}})
    .populate("owner");
    if(!listing){
        req.flash("error","Cannot find that listing!!");
        return res.redirect("/listing");
    }
    res.render("listing/show",{listing,mapToken: process.env.MAP_TOKEN})
};

module.exports.create = async (req,res) => {
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();
    
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;
    await newListing.save();
    req.flash("success","Successfully made a new listing!!");
    res.redirect("/listing");
};

module.exports.edit = async (req,res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Cannot find that listing!!");
        return res.redirect("/listing");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_300,w_250");
    
    res.render("listing/edit",{listing, originalImageUrl})
};

module.exports.update = async (req,res) => {
    let { id } = req.params;
    let updatedListing = await Listing.findByIdAndUpdate(id,req.body.listing,{runValidators:true,new:true});
    if(typeof req.file !== "undefined")
    {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = {url,filename};
        await updatedListing.save();
    }
    req.flash("success","Successfully updated the listing!!");
    res.redirect(`/listing/${updatedListing._id}`);
};

module.exports.delete = async (req,res) => {
    let { id } = req.params;

    // first find the listing
    let listing = await Listing.findById(id);

    // delete image from cloudinary
    if(listing.image && listing.image.filename){
        await cloudinary.uploader.destroy(listing.image.filename);
    }

    // then delete listing from database
    await Listing.findByIdAndDelete(id);

    req.flash("success","Successfully deleted the listing!!");
    res.redirect("/listing");

};