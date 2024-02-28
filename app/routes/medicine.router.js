const express = require("express");
const medicines = require("../controllers/medicine.controler");
const router = express.Router();

router
  .route("/")
  .get(medicines.findAll)
  .post(medicines.create);

router
  .route("/:id")
  .get(medicines.findOne)
  .put(medicines.update)
  .delete(medicines.delete);

module.exports = router;
