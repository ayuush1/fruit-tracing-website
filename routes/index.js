var express = require("express");
// const { cropApi } = require("../public/javascripts/constant");
// const { ethers } = require("../public/javascripts/ethers");
var router = express.Router();

/* GET home page. */
router.get("/buy", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/form", function (req, res, next) {
  res.render("sendDataForm", { title: "Express" });
});
router.get("/", function (req, res, next) {
  res.render("landing_Page", { title: "Express" });
});
router.get("/viewdetails/:id", async function (req, res, next) {
  res.render("details", { title: "title" });
});

module.exports = router;
