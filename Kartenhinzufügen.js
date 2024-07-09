let drawColor = 'black';
let drawMode = false;
let eraserMode = false;

function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

function toggleDrawMode() {
    drawMode = !drawMode;
    if (drawMode) {
        eraserMode = false;
    }
}

function toggleEraserMode() {
    eraserMode = !eraserMode;
    if (eraserMode) {
        drawMode = false;
    }
}

function changeDrawColor(color) {
    drawColor = color;
}

function uploadImages(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            execCmd('insertImage', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function addCard() {
    const frontContent = document.getElementById('front').innerHTML;
    const backContent = document.getElementById('back').innerHTML;

    const historyContainer = document.getElementById('historyContainer');
    const cardHistory = document.createElement('div');
    cardHistory.classList.add('card-history');

    const frontHistory = document.createElement('div');
    frontHistory.classList.add('card-side');
    frontHistory.innerHTML = frontContent;

    const backHistory = document.createElement('div');
    backHistory.classList.add('card-side');
    backHistory.innerHTML = backContent;

    cardHistory.appendChild(frontHistory);
    cardHistory.appendChild(backHistory);
    historyContainer.appendChild(cardHistory);

    document.getElementById('front').innerHTML = '';
    document.getElementById('back').innerHTML = '';
}

function toggleHistory() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.style.display = historyContainer.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const frontCanvas = document.getElementById('frontCanvas');
    const backCanvas = document.getElementById('backCanvas');

    [frontCanvas, backCanvas].forEach(canvas => {
        const context = canvas.getContext('2d');
        let drawing = false;

        canvas.addEventListener('mousedown', () => {
            drawing = true;
        });

        canvas.addEventListener('mouseup', () => {
            drawing = false;
            context.beginPath();
        });

        canvas.addEventListener('mousemove', (event) => {
            if (!drawing) return;
            context.lineWidth = eraserMode ? 10 : 2;
            context.lineCap = 'round';
            context.strokeStyle = eraserMode ? 'white' : drawColor;
            context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
            context.stroke();
            context.beginPath();
            context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        });
    });
});
