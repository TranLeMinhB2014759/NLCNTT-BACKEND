const express = require("express");
const medicalrecords = require("../controllers/medicalrecord.controller");
const router = express.Router();

router
  .route("/")
  .get(medicalrecords.findAll)
  .post(medicalrecords.create);

router
  .route("/:id")
  .get(medicalrecords.findOne)
  .put(medicalrecords.update)
  .delete(medicalrecords.delete);

router
  .route("/phone/:phoneNumber")
  .get(medicalrecords.findByPhoneNumber);

router
  .route("/mshs/:MSHS")
  .get(medicalrecords.findByMSHS);
module.exports = router;