module.exports = (query) => {

    let filterGender = [
        {
            name: "Tất cả",
            gender: "",
            class: ""
        },
        {
            name: "Nam",
            gender: "male",
            class: ""
        },
        {
            name: "Nữ",
            gender: "female",
            class: ""
        },
        {
            name: "Khác",
            gender: "other",
            class: ""
        },
    ];

    if (query.gender) {
        const index = filterGender.findIndex(item => item.gender == query.gender);

        if (index !== -1) {
            filterGender[index].class = "active";
        }
    } else {
        const index = filterGender.findIndex(item => item.gender == "");
        filterGender[index].class = "active";
    }

    return filterGender;
};