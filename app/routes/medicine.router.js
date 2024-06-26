const express = require("express");
const medicines = require("../controllers/medicine.controller");
const router = express.Router();

router
  .route("/")
  .get(medicines.findAll)
  .post(medicines.create)

router
  .route("/:id")
  .get(medicines.findOne)
  .put(medicines.update)
  .delete(medicines.delete);

router
  .route("/active")
  .get(medicines.findActive);

router
  .route("/search/:tenThuoc")
  .get(medicines.findByTenThuoc);

module.exports = router;
