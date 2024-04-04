const express = require("express");
const bills = require("../controllers/bill.controller");
const router = express.Router();

router
  .route("/")
  .get(bills.findAll)
  .post(bills.create)
  .delete(bills.deleteAll);

router
  .route("/:id")
  .get(bills.findOne)
  .delete(bills.delete);

module.exports = router;
