document.getElementById('fontSelect').addEventListener('change', function() {
    execCmd('fontName', this.value);
});

function execCmd(command, value = null) {
    document.execCommand(command, false, value);
}

document.getElementById('addCardButton').addEventListener('click', addCard);

function addCard() {
    const frontContent = document.getElementById('front').innerText;
    const backContent = document.getElementById('back').innerText;
    
    if (frontContent.trim() === '' || backContent.trim() === '') {
        alert('Bitte füllen Sie sowohl die Vorder- als auch die Rückseite der Karte aus.');
        return;
    }
    
    const newCard = {
        front: frontContent,
        back: backContent
    };
    
    cardHistory.push(newCard);
    updateCardList();
    
    document.getElementById('front').innerText = '';
    document.getElementById('back').innerText = '';
}

document.querySelectorAll('.card-side').forEach(side => {
    side.addEventListener('focus', function() {
        if (this.innerText === '') {
            this.innerText = '';
        }
    });
    side.addEventListener('input', function() {
        this.dataset.empty = this.innerText.trim() === '';
    });
});

document.querySelectorAll('.card-side').forEach(side => {
    side.addEventListener('blur', function() {
        if (this.innerText === '') {
            this.dataset.empty = true;
        }
    });
});

const cardHistory = [];

function updateCardList() {
    const cardListContainer = document.getElementById('historyContainer');
    cardListContainer.innerHTML = '';
    
    cardHistory.forEach((card, index) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('history-card');
        
        const frontText = document.createElement('textarea');
        frontText.readOnly = true;
        frontText.value = card.front;
        
        const backText = document.createElement('textarea');
        backText.readOnly = true;
        backText.value = card.back;
        
        cardDiv.appendChild(frontText);
        cardDiv.appendChild(backText);
        
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = 'X';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            confirmDeleteCard(index);
        };
        cardDiv.appendChild(deleteButton);
        
        cardDiv.onclick = () => loadCard(index);
        
        cardListContainer.appendChild(cardDiv);
    });
}

function loadCard(index) {
    const selectedCard = cardHistory[index];
    document.getElementById('front').innerText = selectedCard.front;
    document.getElementById('back').innerText = selectedCard.back;
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
