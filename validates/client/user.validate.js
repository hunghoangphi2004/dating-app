const User = require("../../models/user.model");
const md5 = require("md5");

module.exports.register = async (req, res, next) => {
    const { email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword) {
        req.flash("error", "Vui lòng nhập đầy đủ thông tin");
        return res.redirect(req.get("referer"));
    }

    req.body.email = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(req.body.email)) {
        req.flash("error", "Email không hợp lệ");
        return res.redirect(req.get("referer"));
    }

    if (password.length < 6) {
        req.flash("error", "Mật khẩu tối thiểu 6 ký tự");
        return res.redirect(req.get("referer"));
    }

    if (password !== confirmPassword) {
        req.flash("error", "Mật khẩu không khớp");
        return res.redirect(req.get("referer"));
    }

    const existEmail = await User.findOne({ email: req.body.email });
    if (existEmail) {
        req.flash("error", "Email đã tồn tại");
        return res.redirect(req.get("referer"));
    }

    next();
};

module.exports.login = async (req, res, next) => {
    let { email, password } = req.body;

    if (!email || !password) {
        req.flash("error", "Vui lòng nhập email và mật khẩu");
        return res.redirect(req.get("referer"));
    }

    const user = await User.findOne({ email: email, deleted: false })

    if (!user) {
        req.flash("error", "Không tìm thấy email!");
        res.redirect(req.get("referer"));
        return;
    }

    if (md5(password) !== user.password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect(req.get("referer"));
        return;
    }

    if (user.status === "inactive") {
        req.flash("error", "Tài khoản đã bị khoá!");
        res.redirect(req.get("referer"));
        return;
    }

    req.body.email = email.trim().toLowerCase();

    next();
};

module.exports.pagination = (req, res, next) => {
    let page = parseInt(req.query.page);

    if (isNaN(page) || page < 1) {
        req.query.page = 1;
    }

    next();
};