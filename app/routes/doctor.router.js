const express = require("express");
const doctors = require("../controllers/doctor.controller.js");
const router = express.Router();

router
  .route("/")
  .get(doctors.findAll)
  .post(doctors.create)
  .delete(doctors.deleteAll);

router
  .route("/:id")
  .get(doctors.findDoctorById)
  .put(doctors.update)
  .delete(doctors.delete);

module.exports = router;
