
const nameInput = document.getElementById('tagName');
const bgInput = document.getElementById('bgColor');
const textInput = document.getElementById('textColor');
const preview = document.getElementById('tagPreview');

function updatePreview() {
    preview.textContent = nameInput.value || 'Tag preview';
    preview.style.backgroundColor = bgInput.value;
    preview.style.color = textInput.value;
}

// realtime
[nameInput, bgInput, textInput].forEach(el => {
    el.addEventListener('input', updatePreview);
});

// init lần đầu
updatePreview();

