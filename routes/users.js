const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const users = require("../controllers/users");
const { storeReturnTo } = require("../middleware");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.registerUser));

router
  .route("/login")
  .get(users.renderLogin)
  .post(storeReturnTo, users.loginUser);

router.get("/logout", users.logoutUser);
module.exports = router;
