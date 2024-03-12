const express = require("express");
const diseases = require("../controllers/disease.controller.js");
const router = express.Router();

router
  .route("/")
  .get(diseases.findAll)
  .post(diseases.create)
  .delete(diseases.deleteAll);

router
  .route("/:id")
  .get(diseases.findDiseaseById)
  .put(diseases.update)
  .delete(diseases.delete);

module.exports = router;
