const toggleTheme = document.querySelector(".toggle-theme");
const body = document.body;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    body.classList.add(savedTheme)
} else {
    body.classList.add("theme-light")
}

toggleTheme.addEventListener("click", () => {
    if (body.classList.contains("theme-light")) {
        body.classList.remove("theme-light");
        body.classList.add("theme-dark");
        localStorage.setItem("theme", "theme-dark");
    } else {
        body.classList.remove("theme-dark");
        body.classList.add("theme-light");
        localStorage.setItem("theme", "theme-light")
    }
})

const formSearch = document.querySelector("#form-search");
if (formSearch) {
    formSearch.addEventListener("submit", (e) => {
        const url = new URL(window.location.href);
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        if (keyword) {
            url.searchParams.set("page", 1)
            url.searchParams.set("keyword", keyword)
        } else {
            url.searchParams.delete("keyword")
        }
        window.location.href = url;
    })
}

const buttonPagination = document.querySelectorAll('[button-pagination]');
if (buttonPagination) {
    buttonPagination.forEach((button) => {
        button.addEventListener("click", () => {
            let url = new URL(window.location.href);
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);
            window.location.href = url.href
        })

    })
}

//Button Status
const buttonStatus = document.querySelectorAll('[button-status]');
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    // console.log(url);


    buttonStatus.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute("button-status");

            if (status) {
                url.searchParams.set("status", status)
            }
            else {
                url.searchParams.delete("status");
            }

            console.log(url.href);
            window.location.href = url.href
        })
    })
}
//End Button Status

// show alert
document.addEventListener("DOMContentLoaded", function () {

    const messages = document.querySelectorAll(".flash-message");

    messages.forEach(message => {

        // auto hide sau 4s
        setTimeout(() => {
            message.style.animation = "fadeOut 0.4s ease forwards";
            setTimeout(() => message.remove(), 400);
        }, 4000);

        // nút X
        const btn = message.querySelector(".flash-close");
        btn.addEventListener("click", () => {
            message.style.animation = "fadeOut 0.4s ease forwards";
            setTimeout(() => message.remove(), 400);
        });
    });

});
//end show alert