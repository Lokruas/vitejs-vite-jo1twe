document.getElementById('fontSelect').addEventListener('change', function() {
    execCmd('fontName', this.value);
});

function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

let currentCard = null;

document.querySelectorAll('.card-side').forEach(card => {
    card.addEventListener('focus', () => {
        currentCard = card;
    });
});

document.querySelectorAll('.toolbar button').forEach(button => {
    button.addEventListener('click', () => {
        if (currentCard) {
            currentCard.focus();
        }
    });
});

document.getElementById('fontSelect').addEventListener('change', function() {
    if (currentCard) {
        currentCard.focus();
        execCmd('fontName', this.value);
    }
});

let cardHistory = [];

function addCard() {
    const frontText = document.getElementById('front').innerHTML;
    const backText = document.getElementById('back').innerHTML;
    const newCard = { front: frontText, back: backText };
    cardHistory.push(newCard);
    document.getElementById('front').innerHTML = '';
    document.getElementById('back').innerHTML = '';
    updateCardList();
}

function updateCardList() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.innerHTML = '';

    cardHistory.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('history-card');
        cardDiv.innerHTML = `
            <textarea readonly>${card.front}</textarea>
            <button class="delete-button" onclick="confirmDeleteCard(${index})">✖️</button>
        `;
        cardDiv.onclick = () => loadCard(index);
        historyContainer.appendChild(cardDiv);
    });
}

function loadCard(index) {
    const selectedCard = cardHistory[index];
    document.getElementById('front').innerHTML = selectedCard.front;
    document.getElementById('back').innerHTML = selectedCard.back;
}

function confirmDeleteCard(index) {
    if (confirm('Möchten Sie diese Karte wirklich löschen?')) {
        deleteCard(index);
    }
}

function deleteCard(index) {
    cardHistory.splice(index, 1);
    updateCardList();
}

function openFileDialog() {
    document.getElementById('imageUploader').click();
}

function insertImageFromUpload() {
    const fileInput = document.getElementById('imageUploader');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (currentCard) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                currentCard.appendChild(img);
            }
        };
        reader.readAsDataURL(file);
    }
    fileInput.value = '';
}

// Platzhalter-Logik
document.querySelectorAll('.card-side').forEach(card => {
    card.addEventListener('focus', () => {
        if (card.textContent === card.getAttribute('data-placeholder')) {
            card.textContent = '';
            card.style.opacity = '1';
        }
    });
    card.addEventListener('blur', () => {
        if (card.textContent === '') {
            card.textContent = card.getAttribute('data-placeholder');
            card.style.opacity = '0.6';
        }
    });
    if (card.textContent === '') {
        card.textContent = card.getAttribute('data-placeholder');
        card.style.opacity = '0.6';
    }
});
let isDrawing = false;
let x = 0;
let y = 0;

const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');

canvas.addEventListener('mousedown', e => {
    isDrawing = true;
    x = e.offsetX;
    y = e.offsetY;
});

canvas.addEventListener('mousemove', e => {
    if (isDrawing) {
        drawLine(context, x, y, e.offsetX, e.offsetY);
        x = e.offsetX;
        y = e.offsetY;
    }
});

canvas.addEventListener('mouseup', () => {
    isDrawing = false;
    x = 0;
    y = 0;
});

function drawLine(context, x1, y1, x2, y2) {
    context.beginPath();
    context.strokeStyle = 'red';
    context.lineWidth = 2;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
    context.closePath();
}

function openFileDialog() {
    document.getElementById('imageUploader').click();
}

function insertImageFromUpload() {
    const fileInput = document.getElementById('imageUploader');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            if (currentCard) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.onclick = () => enableDrawingMode(img);
                currentCard.appendChild(img);
            }
        };
        reader.readAsDataURL(file);
    }
    fileInput.value = '';
}

function enableDrawingMode(img) {
    canvas.style.display = 'block';
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    canvas.style.position = 'absolute';
    canvas.style.left = `${img.offsetLeft}px`;
    canvas.style.top = `${img.offsetTop}px`;
}
