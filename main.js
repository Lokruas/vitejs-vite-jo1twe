document.addEventListener("DOMContentLoaded", function() {
    const cardSides = document.querySelectorAll('.card-side');
    const canvas = document.getElementById('drawCanvas');
    const context = canvas.getContext('2d');
    let isDrawing = false;
    let currentColor = '#000000';
    let currentTool = 'cursor';

    // Platzhaltertext
    cardSides.forEach(side => {
        side.addEventListener('input', function() {
            if (this.textContent.trim() === '') {
                this.classList.add('placeholder');
            } else {
                this.classList.remove('placeholder');
            }
        });
    });

    // Bild-Upload
    document.getElementById('imageUpload').addEventListener('change', function(event) {
        const files = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'uploaded-image';
                img.draggable = true;
                img.onmousedown = enableImageResize;
                document.querySelector('.card-side-container .card-side').appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });

    // Karten-Historie
    document.querySelector('.toolbar-history-button').addEventListener('click', function() {
        const historyContainer = document.getElementById('historyContainer');
        historyContainer.style.display = historyContainer.style.display === 'none' ? 'flex' : 'none';
    });

    // Stift aktivieren/deaktivieren
    document.querySelectorAll('.card-side').forEach(side => {
        side.addEventListener('mousedown', function(e) {
            if (currentTool === 'pen') {
                isDrawing = true;
                context.strokeStyle = currentColor;
                context.lineWidth = 3;
                context.lineCap = 'round';
                context.beginPath();
                context.moveTo(e.offsetX, e.offsetY);
            }
        });

        side.addEventListener('mousemove', function(e) {
            if (isDrawing && currentTool === 'pen') {
                context.lineTo(e.offsetX, e.offsetY);
                context.stroke();
            }
        });

        side.addEventListener('mouseup', function() {
            if (isDrawing) {
                context.closePath();
                isDrawing = false;
            }
        });

        side.addEventListener('mouseleave', function() {
            if (isDrawing) {
                context.closePath();
                isDrawing = false;
            }
        });

        side.addEventListener('dblclick', function(e) {
            if (currentTool === 'eraser') {
                context.clearRect(e.offsetX - 10, e.offsetY - 10, 20, 20);
            }
        });
    });

    document.querySelector('.toolbar button[title="Stift"]').addEventListener('click', function() {
        currentTool = currentTool === 'pen' ? 'cursor' : 'pen';
    });

    document.querySelector('.toolbar button[title="Radiergummi"]').addEventListener('click', function() {
        currentTool = 'eraser';
    });

    function enableImageResize(event) {
        const img = event.target;
        let startX, startY, startWidth, startHeight;

        img.addEventListener('mousedown', initResize);

        function initResize(e) {
            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(document.defaultView.getComputedStyle(img).width, 10);
            startHeight = parseInt(document.defaultView.getComputedStyle(img).height, 10);
            document.documentElement.addEventListener('mousemove', doResize);
            document.documentElement.addEventListener('mouseup', stopResize);
        }

        function doResize(e) {
            img.style.width = (startWidth + e.clientX - startX) + 'px';
            img.style.height = (startHeight + e.clientY - startY) + 'px';
        }

        function stopResize() {
            document.documentElement.removeEventListener('mousemove', doResize);
            document.documentElement.removeEventListener('mouseup', stopResize);
        }
    }

    // Zeichnungsfarbe ändern
    function changeDrawColor(color) {
        currentColor = color;
    }
});

function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

function toggleColorPicker(pickerId) {
    const picker = document.getElementById(pickerId);
    picker.style.display = picker.style.display === 'none' ? 'inline-block' : 'none';
}

function addCard() {
    const frontText = document.getElementById('front').innerHTML.trim();
    const backText = document.getElementById('back').innerHTML.trim();
    if (frontText && backText) {
        const historyContainer = document.getElementById('historyContainer');
        const card = document.createElement('div');
        card.className = 'history-card';

        const frontTextarea = document.createElement('textarea');
        frontTextarea.value = frontText;
        frontTextarea.setAttribute('readonly', true);
        frontTextarea.classList.add('history-card-content');

        const backTextarea = document.createElement('textarea');
        backTextarea.value = backText;
        backTextarea.setAttribute('readonly', true);
        backTextarea.classList.add('history-card-content');

        card.appendChild(frontTextarea);
        card.appendChild(backTextarea);
        historyContainer.appendChild(card);

        document.getElementById('front').innerHTML = '';
        document.getElementById('back').innerHTML = '';
    }
}

function toggleHistory() {
    const historyContainer = document.getElementById('historyContainer');
    historyContainer.style.display = historyContainer.style.display === 'none' ? 'block' : 'none';
}

function uploadImages(input) {
    const files = input.files;
    const frontSide = document.getElementById('front');
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'uploaded-image';
            img.draggable = true;
            img.onmousedown = enableImageResize;
            frontSide.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
}

function enableImageResize(event) {
    const img = event.target;
    let startX, startY, startWidth, startHeight;

    img.addEventListener('mousedown', initResize);

    function initResize(e) {
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(img).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(img).height, 10);
        document.documentElement.addEventListener('mousemove', doResize);
        document.documentElement.addEventListener('mouseup', stopResize);
    }

    function doResize(e) {
        img.style.width = (startWidth + e.clientX - startX) + 'px';
        img.style.height = (startHeight + e.clientY - startY) + 'px';
    }

    function stopResize() {
        document.documentElement.removeEventListener('mousemove', doResize);
        document.documentElement.removeEventListener('mouseup', stopResize);
    }
}

function changeDrawColor(color) {
    currentColor = color;
}

document.querySelectorAll('.color-selector button').forEach(button => {
    button.addEventListener('click', () => {
        changeDrawColor(button.style.backgroundColor);
    });
});
