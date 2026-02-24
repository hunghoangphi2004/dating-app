const Match = require("../models/match.model");
const Availability = require("../models/availability.model");

module.exports.checkAndScheduleMatch = async (matchId) => {

    const match = await Match.findOne({
        _id: matchId,
        deleted: false,
    });

    if (!match) return null;

    // Lấy slot 2 bên
    const userASlots = await Availability.find({
        deleted: false,
        matchId,
        userId: match.userAId
    }).lean();

    const userBSlots = await Availability.find({
        deleted: false,
        matchId,
        userId: match.userBId
    }).lean();

    // Nếu 1 trong 2 chưa có slot → chưa đủ điều kiện check
    if (!userASlots.length || !userBSlots.length) {
        return null;
    }

    // Duyệt tìm slot trùng
    for (const a of userASlots) {
        for (const b of userBSlots) {

            const dateA = new Date(a.date).toISOString().slice(0, 10);
            const dateB = new Date(b.date).toISOString().slice(0, 10);

            if (
                dateA === dateB &&
                a.start < b.end &&
                a.end > b.start
            ) {

                const overlapStart = a.start > b.start ? a.start : b.start;
                const overlapEnd = a.end < b.end ? a.end : b.end;

                await Match.updateOne(
                    { _id: matchId },
                    {
                        status: "scheduled",
                        scheduledDate: a.date,
                        scheduledStart: overlapStart,
                        scheduledEnd: overlapEnd
                    }
                );

                return true; 
            }
        }
    }

    return false; 
};