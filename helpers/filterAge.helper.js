module.exports = (query) => {

    let minAge = parseInt(query.minAge) || "";
    let maxAge = parseInt(query.maxAge) || "";

    if (minAge !== "" && minAge < 0) {
        minAge = 0;
    }

    if (maxAge !== "" && maxAge > 100) {
        maxAge = 100;
    }

    if (minAge !== "" && maxAge !== "" && minAge > maxAge) {
        minAge = "";
        maxAge = "";
    }

    return {
        minAge,
        maxAge
    };
};