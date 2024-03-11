const express = require("express");
const diseases = require("../controllers/diseases.controller.js");
const router = express.Router();

router
  .route("/")
  .get(diseases.findAll)
  .post(diseases.create)
  .delete(diseases.deleteAll);

router
  .route("/:id")
  .get(diseases.findDiseasesById)
  .put(diseases.update)
  .delete(diseases.delete);

module.exports = router;
