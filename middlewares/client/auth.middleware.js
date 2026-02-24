const systemConfig = require("../../config/system.js");
const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.tokenUser) {
        return res.redirect(`/user/login`);
    } else {
        const user = await User.findOne({ token: req.cookies.tokenUser }).select("-password -status -deleted");
        if (!user) {
            return res.redirect(`/user/login`);
        } else {
            res.locals.user = user
            next()
        }
       
    }
}

module.exports.checkLogin = async (req, res, next) => {
    try {
        const token = req.cookies.tokenUser;

        if (token) {
            const user = await User.findOne({ token });
            if (user) {
                res.locals.user = user;
            }
        }

        next();
    } catch (err) {
        console.log(err);
        next();
    }
};