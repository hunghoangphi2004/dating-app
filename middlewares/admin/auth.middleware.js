const systemConfig = require("../../config/system.js");
const Account = require("../../models/account.model");

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect("/admin/auth/login");
    }

    const user = await Account.findOne({
        token: req.cookies.token,
        deleted: false
    });

    res.locals.user = user

    if (!user) {
        return res.redirect("/admin/auth/login");
    }

    next();
};