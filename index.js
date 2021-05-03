const express = require("express");
const path = require("path");
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/data/images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

var upload = multer({ storage: storage });

const app = new express();
const port = 3000;

//for development. Accessing from another origin
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// The schemas
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/iqar6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Databases for Rent owners. Those are the first priority for the site
const ROwner = mongoose.model("ROwner", {
  images: [String],
  name: String,
  price: String,
  tel: String,
  departement: String,
  lat: Number,
  lng: Number,
  kind: String,
  id: Number,
  pass: String,
  region: String,
  description: String,
  ip: String,
  occupied: Boolean,
  cTel: String,
  created_at: { type: Date, default: Date.now },
});

// Databases for House owners. Those are the second priority for the site
const HOwner = mongoose.model("HOwner", {
  images: [String],
  name: String,
  price: String,
  lat: Number,
  lng: Number,
  tel: String,
  departement: String,
  kind: String,
  id: String,
  pass: String,
  region: String,
  description: String,
  ip: String,
  cTel: String,
  created_at: { type: Date, default: Date.now },
});

//Databses House searcher. Those has the second lowest priority for us
const HSearcher = mongoose.model("HSearcher", {
  name: String,
  price: String,
  tel: String,
  lat: Number,
  lng: Number,
  departement: String,
  kind: String,
  id: String,
  pass: String,
  region: String,
  description: String,
  ip: String,
  cTel: String,
  created_at: { type: Date, default: Date.now },
});

//Databses Rent searcher. Those has the lowest priority for us
const RSearcher = mongoose.model("RSearcher", {
  name: String,
  price: String,
  tel: String,
  lat: Number,
  lng: Number,
  departement: String,
  kind: String,
  id: String,
  pass: String,
  region: String,
  description: String,
  ip: String,
  cTel: String,
  created_at: { type: Date, default: Date.now },
});

// Create CountId schema to store the incremented id that mongodb lack
const PostId = mongoose.model("PostId", { name: String, count: Number });

// document for blocked users
const Blocked = mongoose.model("Blocked", { tel: String, ip: String });

// map each kind to its mongoose model
const mapO = {
  "Offer Rent": ROwner,
  "Offer Sell": HOwner,
  "Demand Buy": HSearcher,
  "Demand Rent": RSearcher,
};

var pairs = {
  "Offer Rent": RSearcher,
  "Offer Sell": HSearcher,
  "Demand Buy": HOwner,
  "Demand Rent": ROwner,
};

app.use(express.json({ limit: "50mb" }));

// the multer middleware
var cpUpload = upload.fields([{ name: "images", maxCount: 8 }]);

// Add post
app.post("/api/post", cpUpload, async (req, res) => {
  // get the post from the body after the json parsing
  var mpost = req.body;

  if (req.files && req.files["images"]) {
    mpost.images = req.files["images"].map((im) => im.filename);
  }

  // create a document if not yet created that will hold track 'count' for post documents. every time a
  // post is saved the count is icremented and added to the post as id
  var MPostId = await PostId.findOne({ name: "MPostId" }).exec();
  if (!MPostId) MPostId = new PostId({ name: "MPostId", count: 0 });

  // incremened count as new post is arriving
  MPostId.count = MPostId.count + 1;

  // give it the new post as id.
  mpost.id = MPostId.count;
  MPostId.save();

  var kind = mpost.kind;

  var rpost = await new mapO[kind](mpost).save();
  res.send({ admin: true, post: rpost });
});

// Get post by id
app.get("/api/post", async (req, res) => {
  const selectAr = req.query.minified ? ["description", "tel", "cTel"] : [];

  const id = req.query.id;
  const auth = req.query.auth;

  const authenticated = auth == "22118721";
  console.log(auth);

  var mpost1 = await ROwner.find({ id: id, occupied: false })
    .select(selectAr)
    .exec();
  var mpost2 = await RSearcher.find({ id: id }).select(selectAr).exec();
  var mpost3 = await HOwner.find({ id: id }).select(selectAr).exec();
  var mpost4 = await HSearcher.find({ id: id }).select(selectAr).exec();

  if (mpost1[0]) res.send({ admin: authenticated, posts: mpost1 });
  else if (mpost2[0]) res.send({ admin: authenticated, posts: mpost2 });
  else if (mpost3[0]) res.send({ admin: authenticated, posts: mpost3 });
  else if (mpost4[0]) res.send({ admin: authenticated, posts: mpost4 });
  else res.send({ admin: authenticated, posts: [] });
});

app.get("/api/myPosts", async (req, res) => {
  const pass = req.query.pass;
  console.log(pass);

  var mpostRO = await ROwner.find({ pass: pass })
    .sort({ created_at: -1 })
    .exec();
  var mpostRS = await RSearcher.find({ pass: pass })
    .sort({ created_at: -1 })
    .exec();
  var mpostHO = await HOwner.find({ pass: pass })
    .sort({ created_at: -1 })
    .exec();
  var mpostHS = await HSearcher.find({ pass: pass })
    .sort({ created_at: -1 })
    .exec();

  // prepare a response
  var response = mpostRO.concat(mpostRS, mpostHO, mpostHS);

  res.send({ admin: true, posts: response });
});

// Update a post
app.post("/api/update", cpUpload, async (req, res) => {
  const post = req.body;
  const id = post.id;

  if (req.files && req.files["images"]) {
    post.images = req.files["images"].map((im) => im.filename);
  }

  const mpost = await mapO[post.kind].findOneAndUpdate({ id: id }, post);

  res.send({ admin: true, post: mpost });
});

//
app.get("/api/news", async (req, res) => {
  const auth = req.query.auth;
  const admin = auth == "22118721";

  var mpostRO = await ROwner.find({ occupied: false })
    .sort({ created_at: -1 })
    .exec();
  var mpostRS = await RSearcher.find({}).sort({ created_at: -1 }).exec();
  var mpostHO = await HOwner.find({}).sort({ created_at: -1 }).exec();
  var mpostHS = await HSearcher.find({}).sort({ created_at: -1 }).exec();

  // prepare a response
  var response = mpostRO.concat(mpostRS, mpostHO, mpostHS);

  function compare(post1, post2) {
    const date1 = new Date(post1.created_at).getTime();
    const date2 = new Date(post2.created_at).getTime();

    if (date1 >= date2) return -1;
    else return +1;
  }

  response.sort(compare);
  const go = response.map((post) => {
    if (post.images) {
      return post.images.length;
    } else return null;
  });

  const gResponse = {
    admin: admin,
    posts: response.slice(0, 10),
  };
  res.json(gResponse);
});

// populate map
app.get("/api/map", async (req, res) => {
  const selectAr = ["created_at", "id", "kind", "lat", "lng"];
  var mpostRO = await ROwner.find({ occupied: "false" })
    .select(selectAr)
    .sort({ created_at: -1 })
    .exec();
  var mpostRS = await RSearcher.find({})
    .select(selectAr)
    .sort({ created_at: -1 })
    .exec();
  var mpostHO = await HOwner.find({})
    .select(selectAr)
    .sort({ created_at: -1 })
    .exec();
  var mpostHS = await HSearcher.find({})
    .select(selectAr)
    .sort({ created_at: -1 })
    .exec();

  // prepare a response
  var response = mpostRO.concat(mpostRS, mpostHO, mpostHS);

  function compare(post1, post2) {
    const date1 = new Date(post1.created_at).getTime();
    const date2 = new Date(post2.created_at).getTime();

    if (date1 >= date2) return -1;
    else return +1;
  }

  response.sort(compare);
  const go = response.map((post) => {
    if (post.images) {
      return post.images.length;
    } else return null;
  });

  const gResponse = {
    admin: false,
    posts: response,
  };

  res.json(gResponse);
});

// Delete a post
app.post("/api/delete", async (req, res) => {
  const post = req.body;

  var response = await mapO[post.kind].deleteOne({ id: post.id }).exec();

  res.send(response);
});

// This is multer part
var cpUpload = upload.fields([{ name: "images", maxCount: 8 }]);
app.post("/postO", cpUpload, function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any

  let images = [];
  if (req.files["images"]) {
    images = req.files["images"].map((im) => im.filename);
  } else {
  }
});
//
app.listen(port, () => {
  console.log(`Example app listenning at http://localhost:${port}`);
});
