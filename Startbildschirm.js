et db;

document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  let request = indexedDB.open("FlashcardApp", 1);

  request.onupgradeneeded = function(event) {
    db = event.target.result;
    let deckStore = db.createObjectStore("decks", { keyPath: "deckId", autoIncrement: true });
    deckStore.createIndex("parentDeckId", "parentDeckId", { unique: false });
  };

  request.onsuccess = function(event) {
    db = event.target.result;
    loadDecks();
  };

  request.onerror = function(event) {
    console.error("Database error: ", event.target.errorCode);
  };

  const newDeckButton = document.getElementById('new-deck');
  const modal = document.getElementById('modal');
  const closeButton = document.querySelector('.close');
  const saveDeckButton = document.getElementById('save-deck');
  const deckNameInput = document.getElementById('deck-name');
  let dragged;

  newDeckButton.addEventListener('click', () => {
    modal.style.display = 'block';
  });

  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  saveDeckButton.addEventListener('click', () => {
    const deckName = deckNameInput.value;
    if (deckName.trim() !== '') {
      addDeckToDB(deckName);
      modal.style.display = 'none';
      deckNameInput.value = '';
    }
  });
}

function addDeckToDB(deckName, parentDeckId = null) {
  let transaction = db.transaction(["decks"], "readwrite");
  let deckStore = transaction.objectStore("decks");

  let deck = {
    name: deckName,
    parentDeckId: parentDeckId
  };

  let request = deckStore.add(deck);

  request.onsuccess = function() {
    console.log("Deck added successfully");
    loadDecks();
  };

  request.onerror = function() {
    console.log("Error adding deck");
  };
}

function updateDeckParent(deckId, parentDeckId) {
  let transaction = db.transaction(["decks"], "readwrite");
  let deckStore = transaction.objectStore("decks");
  let request = deckStore.get(Number(deckId)); // Ensure deckId is a number

  request.onsuccess = function(event) {
    let deck = event.target.result;
    deck.parentDeckId = parentDeckId;
    let updateRequest = deckStore.put(deck);

    updateRequest.onsuccess = function() {
      console.log("Deck updated successfully");
      loadDecks();
    };

    updateRequest.onerror = function() {
      console.log("Error updating deck");
    };
  };

  request.onerror = function() {
    console.log("Error getting deck");
  };
}

function loadDecks() {
  let transaction = db.transaction(["decks"], "readonly");
  let deckStore = transaction.objectStore("decks");
  let request = deckStore.getAll();

  request.onsuccess = function(event) {
    let decks = event.target.result;
    displayDecks(decks);
  };

  request.onerror = function() {
    console.log("Error loading decks");
  };
}

function displayDecks(decks) {
  const deckList = document.getElementById('deck-list');
  deckList.innerHTML = ''; // Bestehende Decks entfernen

  let deckMap = {};
  decks.forEach(deck => {
    deckMap[deck.deckId] = deck;
  });

  decks.forEach(deck => {
    const newDeck = createDeckElement(deck);
    if (deck.parentDeckId === null) {
      deckList.appendChild(newDeck);
    } else {
      const parentDeckElement = document.querySelector(`[data-deck-id='${deck.parentDeckId}'] .sub-decks`);
      if (parentDeckElement) {
        parentDeckElement.appendChild(newDeck);
        parentDeckElement.classList.add('show');
      }
    }
  });
}

function createDeckElement(deck) {
  const newDeck = document.createElement('li');
  newDeck.classList.add('deck');
  newDeck.setAttribute('draggable', 'true');
  newDeck.setAttribute('data-deck-id', deck.deckId);
  newDeck.innerHTML = `
    <div class="deck-header">
      <button class="toggle" style="display: none;">+</button>
      <span class="deck-title">${deck.name}</span>
      <span class="deck-count">0</span>
      <span class="card-counts">
        <span class="new-count">0</span>
        <span class="due-count">0</span>
      </span>
      <div class="menu-button-container">
        <button class="menu-button">...</button>
        <div class="dropdown-menu">
          <a href="#" class="rename-deck">Umbenennen</a>
          <a href="#" class="delete-deck">Löschen</a>
          <a href="#" class="add-cards">Karten hinzufügen</a>
        </div>
      </div>
    </div>
    <ul class="sub-decks"></ul>
  `;
  addDeckEvents(newDeck);
  return newDeck;
}

function addDeckEvents(deck) {
  deck.addEventListener('dragstart', (e) => {
    dragged = e.target;
    e.target.style.opacity = .5;
  });

  deck.addEventListener('dragend', (e) => {
    e.target.style.opacity = "";
  });

  deck.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  deck.addEventListener('drop', (e) => {
    e.preventDefault();
    const targetDeck = e.target.closest('.deck');
    if (targetDeck && dragged !== targetDeck) {
      const subDecks = targetDeck.querySelector('.sub-decks');
      subDecks.appendChild(dragged);
      subDecks.classList.add('show');
      checkForSubDecks(targetDeck);
      updateDeckParent(dragged.getAttribute('data-deck-id'), targetDeck.getAttribute('data-deck-id'));
    }
  });
}

function checkForSubDecks(deck) {
  const subDecks = deck.querySelector('.sub-decks');
  const toggle = deck.querySelector('.toggle');
  if (subDecks && subDecks.children.length > 0) {
    toggle.style.display = 'inline';
    toggle.textContent = subDecks.classList.contains('show') ? '-' : '+';
  } else {
    toggle.style.display = 'none';
  }
}

document.querySelectorAll('.deck').forEach(deck => {
  addDeckEvents(deck);
});
