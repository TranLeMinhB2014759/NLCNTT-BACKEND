const express = require("express");
const patient = require("../controllers/patient.controller.js");
const router = express.Router();

router
  .route("/")
  .get(patient.findAll)
  .post(patient.create)
  .delete(patient.deleteAll);

router
  .route("/:id")
  .get(patient.findPatientById)
  .put(patient.update)
  .delete(patient.delete);

router
  .route("/phone/listphone")
  .get(patient.listPhoneNumber);

router
  .route("/patient/:phoneNumber")
  .post(patient.findPatientByPhoneNumber)

module.exports = router;