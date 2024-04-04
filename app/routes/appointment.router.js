const express = require("express");
const appointments = require("../controllers/appointment.controller");
const router = express.Router();

router
  .route("/")
  .get(appointments.findAll)
  .post(appointments.create)
  .delete(appointments.deleteAll);

router
  .route("/:id")
  .get(appointments.findOne)
  .delete(appointments.delete);

router
  .route("/confirm/:id")
  .put(appointments.update);

router
  .route("/cancel/:id")
  .put(appointments.cancel);

module.exports = router;