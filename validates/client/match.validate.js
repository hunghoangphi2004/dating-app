const Match = require("../../models/match.model");
const Availability = require("../../models/availability.model");

module.exports.validateAddSlot = async (req, res, next) => {
    try {
        const matchId = req.params.id;
        const currentUserId = res.locals.user.id;
        const { date, start, end } = req.body;

        if (!date || !start || !end) {
            req.flash("error", "Vui lòng nhập đầy đủ thông tin");
            return res.redirect(req.get("referer"));
        }

        const selectedDate = new Date(date);
        if (isNaN(selectedDate.getTime())) {
            req.flash("error", "Ngày không hợp lệ");
            return res.redirect(req.get("referer"));
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
            req.flash("error", "Không thể chọn ngày trong quá khứ");
            return res.redirect(req.get("referer"));
        }

        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

        if (!timeRegex.test(start) || !timeRegex.test(end)) {
            req.flash("error", "Giờ không hợp lệ");
            return res.redirect(req.get("referer"));
        }

        if (start >= end) {
            req.flash("error", "Giờ bắt đầu phải nhỏ hơn giờ kết thúc");
            return res.redirect(req.get("referer"));
        }

        const duration =
            (new Date(`1970-01-01T${end}:00`) -
                new Date(`1970-01-01T${start}:00`)) / 60000;

        if (duration < 30) {
            req.flash("error", "Slot tối thiểu 30 phút");
            return res.redirect(req.get("referer"));
        }

        const match = await Match.findOne({
            _id: matchId,
            deleted: false,
            status: { $in: ["matched", "scheduled"] }
        });

        if (!match) {
            return res.redirect("/user/match");
        }

        if (
            match.userAId.toString() !== currentUserId &&
            match.userBId.toString() !== currentUserId
        ) {
            return res.redirect("/user/match");
        }

        if (match.status === "scheduled") {
            req.flash("error", "Match đã được lên lịch");
            return res.redirect(req.get("referer"));
        }

        const slotCount = await Availability.countDocuments({
            matchId,
            userId: currentUserId
        });

        if (slotCount >= 10) {
            req.flash("error", "Tối đa 10 slot");
            return res.redirect(req.get("referer"));
        }

        const overlapping = await Availability.findOne({
            matchId,
            userId: currentUserId,
            date,
            start: { $lt: end },
            end: { $gt: start }
        });

        if (overlapping) {
            req.flash("error", "Khung giờ bị trùng");
            return res.redirect(req.get("referer"));
        }

        next();
    } catch (error) {
        console.log(error);
        res.redirect(req.get("referer"));
    }
};