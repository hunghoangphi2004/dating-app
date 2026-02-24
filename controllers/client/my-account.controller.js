const User = require("../../models/user.model")
const systemConfig = require("../../config/system.js")
const md5 = require('md5')

module.exports.profile = async (req, res) => {
    res.render("client/pages/my-account/profile", {
        layout: "client/layouts/default",
        title: "Thông tin cá nhân",
        user: res.locals.user
    })
}


module.exports.editProfile = async (req, res) => {
   try{
     console.log(req.body)
    const id = res.locals.user.id
    await User.updateOne(
        { _id: id },
        req.body
    );
    req.flash("success", "Cập nhật hồ sơ thành công!");
    res.redirect(req.get("referer"));
   } catch(err){
    req.flash("error", "Có lỗi xảy ra khi cập nhật hồ sơ!");
    res.redirect(req.get("referer"));
   }
}
