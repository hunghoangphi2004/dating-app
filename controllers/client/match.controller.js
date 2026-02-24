const Match = require("../../models/match.model");
const User = require("../../models/user.model");
const Availability = require("../../models/availability.model");
const formatDateHelper = require("../../helpers/formatDate.helper");
const matchService = require("../../services/match.service");

// [GET] /user/match
module.exports.matchList = async (req, res) => {
    const currentUserId = res.locals.user.id;

    const matches = await Match.find({
        deleted: false,
        status: { $in: ["matched", "scheduled"] },
        $or: [
            { userAId: currentUserId },
            { userBId: currentUserId }
        ]
    });

    const result = [];

    for (const match of matches) {

        const otherUserId =
            match.userAId.toString() === currentUserId.toString()
                ? match.userBId
                : match.userAId;

        const user = await User.findById(otherUserId).lean();

        if (user) {
            result.push({
                ...user,
                matchId: match._id
            });
        }
    }

    res.render("client/pages/user/match", {
        layout: "client/layouts/default",
        title: "Matched",
        users: result
    })
};

module.exports.scheduleForm = async (req, res) => {
    const matchId = req.params.id;
    const currentUserId = res.locals.user.id;

    let match = await Match.findOne({ _id: matchId, deleted: false });

    if (!match || (match.status !== "matched" && match.status !== "scheduled")) {
        return res.redirect("/user/match");
    }

    if (match.status === "scheduled" && match.scheduledDate) {
        match.formattedScheduledDate =
            formatDateHelper.formatDateVN(match.scheduledDate);
    }

    const userASlots = await Availability.find({
        matchId,
        userId: match.userAId
    }).lean();

    const userBSlots = await Availability.find({
        matchId,
        userId: match.userBId
    }).lean();

    const bothSelected =
        userASlots.length > 0 && userBSlots.length > 0;

    let mySlots = await Availability.find({
        matchId,
        deleted: false,
        userId: currentUserId
    }).lean();

    const otherUserId =
        match.userAId.toString() === currentUserId.toString()
            ? match.userBId
            : match.userAId;

    const otherUser = await User.findOne({ _id: otherUserId, deleted: false }).lean();

    mySlots = mySlots.map(slot => ({
        ...slot,
        formattedDate: formatDateHelper.formatDateVN(slot.date)
    }));

    res.render("client/pages/user/schedule", {
        layout: "client/layouts/default",
        title: "Schedule",
        match,
        mySlots,
        otherUser,
        bothSelected
    })
};

module.exports.addSlot = async (req, res) => {
    const matchId = req.params.id;
    const currentUserId = res.locals.user.id;

    const { date, start, end } = req.body;


    const match = await Match.findOne({
        _id: matchId,
        deleted: false,
        status: { $in: ["matched", "scheduled"] }
    });

    if (!match) {
        return res.redirect("/user/match");
    }

    if (match.status === "scheduled") {
        return res.redirect(req.get("referer"));
    }

    await Availability.create({
        matchId,
        userId: currentUserId,
        date,
        start,
        end
    });

    const result = await matchService.checkAndScheduleMatch(matchId);

    if (result === false) {
        // thong bao chua tim duoc
    }

    return res.redirect(req.get("referer"));
};

module.exports.deleteSlot = async (req, res) => {
    const { matchId, slotId } = req.params;

    const slot = await Availability.findOne({
        _id: slotId,
        deleted: false
    });

    if (!slot) return res.redirect(req.get("referer"));

    // Xoá slot
    await Availability.updateOne(
        { _id: slotId },
        { deleted: true }
    );

    const match = await Match.findOne({ _id: matchId });

    if (!match) {
        return res.redirect(req.get("referer"));
    }

    // Nếu đang scheduled thì reset trước
    if (match.status === "scheduled") {
        await Match.updateOne(
            { _id: matchId },
            {
                status: "matched",
                scheduledDate: null,
                scheduledStart: null,
                scheduledEnd: null
            }
        );
    }

    // Tính lại từ đầu
    await matchService.checkAndScheduleMatch(matchId);

    res.redirect(req.get("referer"));
};