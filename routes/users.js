const express = require("express");
const passport = require("passport");

const users = require("../controllers/users.js");

const router = express.Router();

router.route("/register")
    .get(users.renderRegister)
    .post(users.register);

router.route("/login")
    .get(users.renderLogin) //FIXME: リダイレクトによる強制ログイン以外でも、ログイン前のページに戻りたい(?)
    .post(
        passport.authenticate("local", {failureFlash: true, failureRedirect: "/login", keepSessionInfo: true}),
        users.login
    );

router.get("/logout", users.logout);

module.exports = router;