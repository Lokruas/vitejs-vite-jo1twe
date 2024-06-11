// Funktion, um den execCommand auszuführen
function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

// Funktion, um Bilder hochzuladen
function uploadImage(input) {
    if (input.files) {
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'image-resizable';
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';

                const resizeHandle = document.createElement('div');
                resizeHandle.className = 'resize-handle';
                imgContainer.appendChild(img);
                imgContainer.appendChild(resizeHandle);

                imgContainer.style.position = 'relative';
                imgContainer.draggable = true;

                imgContainer.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/html', imgContainer.outerHTML);
                    imgContainer.remove();
                });

                imgContainer.addEventListener('drop', (e) => {
                    e.preventDefault();
                    imgContainer.style.left = e.clientX + 'px';
                    imgContainer.style.top = e.clientY + 'px';
                });

                imgContainer.addEventListener('dragover', (e) => {
                    e.preventDefault();
                });

                insertHtmlAtCursor(imgContainer.outerHTML);
            };
            reader.readAsDataURL(file);
        });
    }
}

// Funktion, um HTML an der Cursorposition einzufügen
function insertHtmlAtCursor(html) {
    const range = window.getSelection().getRangeAt(0);
    const fragment = range.createContextualFragment(html);
    range.insertNode(fragment);
}

// Platzhalter für die Eingabefelder
document.querySelectorAll('.card-side').forEach(element => {
    element.addEventListener('focus', function() {
        const placeholder = this.getAttribute('data-placeholder');
        if (this.textContent === placeholder) {
            this.textContent = '';
            this.classList.remove('placeholder');
        }
    });

    element.addEventListener('input', function() {
        if (this.textContent !== '') {
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
});

// Initialisierung der Platzhalter
document.querySelectorAll('.card-side').forEach(element => {
    const placeholder = element.getAttribute('data-placeholder');
    if (element.textContent === '') {
        element.textContent = placeholder;
        element.classList.add('placeholder');
    }
});

// Funktion, um eine Karte hinzuzufügen
function addCard() {
    const front = document.getElementById('front').innerHTML.trim();
    const back = document.getElementById('back').innerHTML.trim();
    const historyContainer = document.getElementById('historyContainer');

    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
        <div class="front-content">${front}</div>
        <button class="delete-button" onclick="deleteCard(event, this)">×</button>
    `;
    card.onclick = function() {
        document.getElementById('front').innerHTML = front;
        document.getElementById('back').innerHTML = back;
    };

    historyContainer.insertBefore(card, historyContainer.firstChild);
}

// Funktion, um eine Karte zu löschen
function deleteCard(event, button) {
    event.stopPropagation();
    const confirmed = confirm('Möchten Sie diese Karte wirklich löschen?');
    if (confirmed) {
        button.parentElement.remove();
    }
}

// Zeichnungsmodus
let isDrawing = false;
let drawColor = '#000000';
const canvas = document.getElementById('drawCanvas');
const ctx = canvas.getContext('2d');
let startX, startY;

function toggleDrawMode() {
    if (isDrawing) {
        isDrawing = false;
        canvas.style.display = 'none';
        canvas.style.zIndex = '-1';
    } else {
        isDrawing = true;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.display = 'block';
        canvas.style.zIndex = '1000';
    }
}

function setDrawColor(color) {
    drawColor = color;
    ctx.strokeStyle = drawColor;
}

function activateEraser() {
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
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
