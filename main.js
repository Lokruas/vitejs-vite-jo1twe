// Platzhalter-Text-Logik
document.querySelectorAll('.card-side').forEach(element => {
    element.addEventListener('focus', function() {
        const placeholder = this.getAttribute('data-placeholder');
        if (this.textContent === placeholder) {
            this.textContent = '';
            this.classList.remove('placeholder');
        }
    });

    element.addEventListener('blur', function() {
        if (this.textContent.trim() === '') {
            const placeholder = this.getAttribute('data-placeholder');
            this.textContent = placeholder;
            this.classList.add('placeholder');
        }
    });

    // Initiale Platzhalteranzeige
    const placeholder = element.getAttribute('data-placeholder');
    if (element.textContent.trim() === '') {
        element.textContent = placeholder;
        element.classList.add('placeholder');
    }
});

// Funktion, um eine Karte hinzuzufügen
function addCard() {
    const front = document.getElementById('front').textContent.trim();
    const back = document.getElementById('back').textContent.trim();
    const historyContainer = document.getElementById('historyContainer');

    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
        <div class="front-preview">${front}</div>
        <button class="delete-button" onclick="deleteCard(event, this)">×</button>
    `;
    card.onclick = function() {
        document.getElementById('front').textContent = front;
        document.getElementById('back').textContent = back;
        checkPlaceholders();
    };

    historyContainer.appendChild(card);

    // Leeren der Eingabefelder und Platzhalter aktualisieren
    document.getElementById('front').textContent = '';
    document.getElementById('back').textContent = '';
    checkPlaceholders();
}

// Funktion, um eine Karte zu löschen
function deleteCard(event, button) {
    event.stopPropagation();
    const confirmed = confirm('Möchten Sie diese Karte wirklich löschen?');
    if (confirmed) {
        button.parentElement.remove();
    }
}

// Editor-Befehle ausführen
function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

// Bild-Upload-Funktion
function uploadImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '100%';
            img.style.display = 'block';
            const range = window.getSelection().getRangeAt(0);
            range.insertNode(img);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// Zeichnungsmodus
let isDrawing = false;
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let startX, startY;

function toggleDrawMode() {
    const colorSelector = document.getElementById('colorSelector');
    if (canvas.style.display === 'block') {
        canvas.style.display = 'none';
        colorSelector.style.display = 'none';
        canvas.style.zIndex = '-1';
        isDrawing = false;
    } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.display = 'block';
        colorSelector.style.display = 'block';
        canvas.style.zIndex = '1000';
        isDrawing = true;
    }
}

canvas.addEventListener('mousedown', (e) => {
    if (!isDrawing) return;
    startX = e.clientX;
    startY = e.clientY;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
});

canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    if (e.buttons !== 1) return; // Nur bei gedrückter Maustaste zeichnen
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    ctx.lineTo(mouseX, mouseY);
    ctx.stroke();
});

canvas.addEventListener('mouseup', () => {
    if (!isDrawing) return;
    ctx.closePath();
});

// Stiftfarbe ändern
function changeDrawColor(color) {
    ctx.strokeStyle = color;
}

// Platzhalter überprüfen und einstellen
function checkPlaceholders() {
    document.querySelectorAll('.card-side').forEach(element => {
        const placeholder = element.getAttribute('data-placeholder');
        if (element.textContent.trim() === '') {
            element.textContent = placeholder;
            element.classList.add('placeholder');
        } else {
            element.classList.remove('placeholder');
        }
    });
}

document.addEventListener('DOMContentLoaded', checkPlaceholders);
