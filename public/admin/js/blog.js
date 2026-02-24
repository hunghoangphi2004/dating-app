function applyTagColor() {
    document.querySelectorAll(".tag-list .tag").forEach(tag => {
        tag.style.setProperty("--bg", tag.dataset.bg);
        tag.style.setProperty('--text', tag.dataset.text);
    });
}

document.querySelector("form").addEventListener("submit", () => {
    tinymce.triggerSave();
});

document.addEventListener("DOMContentLoaded", () => {
    applyTagColor();

    new TomSelect("#select-state", {
        plugins: ['remove_button'],
        maxItems: 3,
        placeholder: "Chọn tag...",

        onInitialize() {
            Object.values(this.options).forEach(opt => {
                opt.bg = opt.$option.dataset.bg;
                opt.color = opt.$option.dataset.color;
            });
        },

        render: {
            item: function (data, escape) {
                return `
                    <div class="item tag-badge px-2 py-1 rounded"
                         style="background:${data.bg};color:${data.color}">
                        ${escape(data.text)}
                    </div>
                `;
            },

            option: function (data, escape) {
                return `
                    <div class="d-flex align-items-center gap-2">
                        <span style="
                            width:10px;
                            height:10px;
                            border-radius:50%;
                            background:${data.bg};
                        "></span>
                        ${escape(data.text)}
                    </div>
                `;
            }
        }
    });
});

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

