const User = require("../models/user.js");

module.exports.renderRegister = (req, res) => {
    res.render("users/register.ejs");
};

module.exports.register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, e => {
            if (e) { return next(e); }
            req.flash("success", "Yelp Campへようこそ!");
            res.redirect("/campgrounds");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", `${req.body.username}さん、おかえりなさい!!!`);
    const url = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(url);
};

module.exports.logout = (req, res) => {
    req.logout(e => {
        if (e) { return next(e); }
        req.flash("success", "ログアウトしました。");
        res.redirect("/campgrounds");
    });
};
