module.exports.formatDateVN = (date) => {
    if (!date) return "";

    const formatted = new Date(date).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

module.exports.formatDateOnly = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
}

module.exports.timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
}