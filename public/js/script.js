//Upload Image
const uploadImage = document.querySelector('[upload-image]');
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    console.log(uploadImageInput, uploadImagePreview)
    uploadImageInput.addEventListener('change', (e) => {
        // console.log(e)
        const file = e.target.files[0];
        if (file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            console.log(uploadImagePreview.src)
        }
    })
}

//End Upload Image

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

//Button Gender
const buttonGender = document.querySelectorAll('[button-gender]');
if (buttonGender.length > 0) {
    let url = new URL(window.location.href);
    // console.log(url);


    buttonGender.forEach(button => {
        button.addEventListener('click', () => {
            const gender = button.getAttribute("button-gender");

            if (gender) {
                url.searchParams.set("gender", gender)
            }
            else {
                url.searchParams.delete("gender");
            }

            console.log(url.href);
            window.location.href = url.href
        })
    })
}
//End Button Gender

// Button Age
const buttonAge = document.querySelector('[button-age]');

if (buttonAge) {
    buttonAge.addEventListener('click', () => {

        const url = new URL(window.location.href); // tạo mới mỗi lần click

        const minAgeInput = document.querySelector('[input-min-age]');
        const maxAgeInput = document.querySelector('[input-max-age]');

        const minAge = minAgeInput.value.trim();
        const maxAge = maxAgeInput.value.trim();

        // Validate nhẹ phía client
        if (minAge && maxAge && Number(minAge) > Number(maxAge)) {
            alert("Tuổi từ không được lớn hơn tuổi đến");
            return;
        }

        if (minAge) {
            url.searchParams.set("minAge", minAge);
        } else {
            url.searchParams.delete("minAge");
        }

        if (maxAge) {
            url.searchParams.set("maxAge", maxAge);
        } else {
            url.searchParams.delete("maxAge");
        }

        // Reset pagination khi filter
        url.searchParams.delete("page");

        window.location.href = url.href;
    });
}
// End Button Age


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