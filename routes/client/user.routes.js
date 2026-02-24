const router = require("express").Router();
const userController = require("../../controllers/client/user.controller")
const myAccountController = require("../../controllers/client/my-account.controller.js")
const matchController = require("../../controllers/client/match.controller.js")
const multer = require('multer');
const upload = multer();
const uploadCloud = require("../../middlewares/client/uploadCloud.middleware.js");
const authMiddleware = require("../../middlewares/client/auth.middleware.js");
const matchValidate = require("../../validates/client/match.validate.js");
const userValidate = require("../../validates/client/user.validate.js")

router.get("/list", authMiddleware.requireAuth, userValidate.pagination, userController.list)
router.get("/register", userController.register)
router.post("/register", userValidate.register, upload.single('avatar'), uploadCloud.upload, userController.registerPost)
router.get("/login", userController.login)
router.post("/login", userValidate.login, userController.loginPost)
router.get("/logout", authMiddleware.requireAuth, userController.logout)
router.get("/profile", authMiddleware.requireAuth, myAccountController.profile)
router.post("/edit-profile", authMiddleware.requireAuth, upload.single('avatar'), uploadCloud.upload, myAccountController.editProfile)
router.post("/like/:id", authMiddleware.requireAuth, userController.like)
router.get("/match", authMiddleware.requireAuth, matchController.matchList)
router.get("/match/schedule/:id", authMiddleware.requireAuth, matchController.scheduleForm);
router.post("/match/schedule/:id", authMiddleware.requireAuth, matchValidate.validateAddSlot, matchController.addSlot);
router.post("/match/schedule/:matchId/delete/:slotId", authMiddleware.requireAuth, matchController.deleteSlot);

module.exports = router;
