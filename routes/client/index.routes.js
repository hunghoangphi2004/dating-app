const userRoutes = require("../../routes/client/user.routes.js");
const homeRoutes = require("../../routes/client/home.routes.js");
const countMatchMiddleware = require("../../middlewares/client/countMatch.middleware.js")
const authMiddleware = require("../../middlewares/client/auth.middleware.js")

module.exports = (app) => {
    app.use(authMiddleware.checkLogin);
    app.use(countMatchMiddleware.countMatch);
    app.use('/', homeRoutes)
    app.use('/user', userRoutes)
}