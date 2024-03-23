const express = require("express");
const services = require("../controllers/service.controller.js");
const router = express.Router();

router
  .route("/")
  .get(services.findAll)
  .post(services.create)
  .delete(services.deleteAll);

router
  .route("/:id")
  .get(services.findServiceById)
  .put(services.update)
  .delete(services.delete);

module.exports = router;
