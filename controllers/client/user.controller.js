const User = require("../../models/user.model");
const Match = require("../../models/match.model");
const systemConfig = require("../../config/system.js");
const filterGenderHelper = require("../../helpers/filterGender.helper.js");
const filterAgeHelper = require("../../helpers/filterAge.helper");
const md5 = require("md5");

// [GET] /user/list
module.exports.list = async (req, res) => {
    try {

        const currentUserId = res.locals.user.id;

        const likesMatches = await Match.find({
            $or: [
                { userAId: currentUserId, actionA: "like" },
                { userBId: currentUserId, actionB: "like" }
            ]
        })

        const likedUserIds = likesMatches.map(match => {
            if (match.userAId.toString() === currentUserId.toString()) {
                return match.userBId;
            }
            return match.userAId;
        })

        let find = {
            deleted: false,
            status: "active",
            _id: {
                $ne: currentUserId,
                $nin: likedUserIds
            },
        }
        const filterGender = filterGenderHelper(req.query);
        const filterAge = filterAgeHelper(req.query);

        if (req.query.gender) {
            find.gender = req.query.gender
        }

        // Filter age
        if (filterAge.minAge || filterAge.maxAge) {
            find.age = {};

            if (filterAge.minAge) {
                find.age.$gte = filterAge.minAge;
            }

            if (filterAge.maxAge) {
                find.age.$lte = filterAge.maxAge;
            }
        }

        objectPagination = {
            limitItems: 4,
            currentPage: parseInt(req.query.page) || 1,
        }

        let countUser = await User.countDocuments(find);
        let skip = objectPagination.limitItems * (objectPagination.currentPage - 1);
        let totalPage = Math.ceil(countUser / objectPagination.limitItems)

        objectPagination.skip = skip;
        objectPagination.totalPage = totalPage;

        let users = await User.find(find).select("-status -deleted -token -createdAt -updatedAt -__v")
            .lean().skip(objectPagination.skip).limit(objectPagination.limitItems);
        res.render("client/pages/user/list", {
            layout: "client/layouts/default",
            title: "Danh sách",
            users,
            filterAge,
            filterGender: filterGender,
            objectPagination
        })
    } catch (err) {
        console.log(err)
    }
}

// [POST] /user/like/:id
module.exports.like = async (req, res) => {
    try {
        const targetUserId = req.params.id;
        const currentUserId = res.locals.user.id;

        if (currentUserId === targetUserId) {
            return res.redirect(req.get("referer"));
        }

        let match = await Match.findOne({
            deleted: false,
            $or: [
                { userAId: currentUserId, userBId: targetUserId },
                { userAId: targetUserId, userBId: currentUserId }
            ]
        });

        if (!match) {
            await Match.create({
                userAId: currentUserId,
                userBId: targetUserId,
                actionA: "like",
                actionAAt: new Date()

            });
            req.flash("success", "Đã thích!");
        } else {
            if (match.userAId.toString() === currentUserId.toString()) {
                match.actionA = "like";
                match.actionAAt = new Date();
            } else {
                match.actionB = "like";
                match.actionBAt = new Date();
            }

            if (match.actionA === "like" && match.actionB === "like") {
                match.status = "matched";
                match.matchedAt = new Date();
                req.flash("success", "It’s a Match");
            }

            await match.save();
        }


        return res.redirect(req.get("referer"));

    } catch (err) {
        console.log(err)
    }
};

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        layout: "client/layouts/auth",
        title: "Đăng ký",
    })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    try {
        const existEmail = await User.findOne({ email: req.body.email })

        if (existEmail) {
            req.flash("error", "Email đã tồn tại")
            res.redirect(req.get("referer"));
            return;
        }

        req.body.password = md5(req.body.password)
        const user = new User(req.body);
        await user.save();

        req.flash("success", "Đăng ký thành công!");
        res.cookie("tokenUser", user.tokenUser)

        res.redirect("/user/login")
    } catch (err) {
        req.flash("error", "Có lỗi xảy ra khi đăng ký!");
        res.redirect("/user/login")
    }
}

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        layout: "client/layouts/auth",
        title: "Đăng nhập",
    })
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email, deleted: false })

    req.flash("success", "Đăng nhập thành công!");
    res.cookie("tokenUser", user.token);
    res.redirect("/user/list");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
    res.redirect("/user/login");
}