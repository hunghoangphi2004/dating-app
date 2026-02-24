module.exports.index = async (req, res) => {
    res.render("client/pages/home/index", {
        layout: false,
        title: "Trang chủ",
    })
}