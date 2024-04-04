const express = require("express");
const staff = require("../controllers/staff.controller.js");
const router = express.Router();

router
  .route("/")
  .get(staff.findAll)
  .post(staff.create)
  .delete(staff.deleteAll);

router.post("/login", staff.login);
router.post('/logout', staff.logout);

router
  .route("/:id")
  .get(staff.findStaffById)
  .put(staff.update)
  .delete(staff.delete);

module.exports = router;
