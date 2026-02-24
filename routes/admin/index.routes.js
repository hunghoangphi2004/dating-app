const blogRoutes = require("./blog.routes");
const dashboardRoutes = require("./dashboard.routes");
const tagRoutes = require("./tag.routes")
const settingRoutes = require("./settings-general.routes")
const authRoutes = require("./auth.routes.js")
const systemConfig = require("../../config/system");

const authMiddleware = require("../../middlewares/admin/auth.middleware.js")

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/blogs", authMiddleware.requireAuth, blogRoutes);
    app.use(PATH_ADMIN + "/dashboard", authMiddleware.requireAuth, dashboardRoutes);
    app.use(PATH_ADMIN + "/tags", authMiddleware.requireAuth, tagRoutes);
    app.use(PATH_ADMIN + "/settings", authMiddleware.requireAuth, settingRoutes);
    app.use(PATH_ADMIN + "/auth", authRoutes)
}