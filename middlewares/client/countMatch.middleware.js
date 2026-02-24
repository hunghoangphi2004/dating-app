const Match = require("../../models/match.model");

module.exports.countMatch = async (req, res, next) => {
    try {
        if (!res.locals.user) {
            return next();
        }

        const currentUserId = res.locals.user.id;

        const count = await Match.countDocuments({
            deleted: false,
            status: "matched",
            $or: [
                { userAId: currentUserId },
                { userBId: currentUserId }
            ]
        });

        res.locals.matchCount = count;

        next();
    } catch (err) {
        console.log(err);
        next();
    }
};