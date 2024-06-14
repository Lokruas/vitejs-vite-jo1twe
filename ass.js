document.addEventListener('DOMContentLoaded', () => {
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
          const newDeck = document.createElement('li');
          newDeck.classList.add('deck');
          newDeck.setAttribute('draggable', 'true');
          newDeck.innerHTML = `
              <div class="deck-header">
                  <button class="toggle" style="display: none;">+</button>
                  <span class="deck-title">${deckName}</span>
                  <span class="deck-count">0</span>
                  <span class="card-counts">
                      <span class="new-count">0</span>
                      <span class="due-count">0</span>
                  </span>
                  <div class="menu-button-container">
                      <button class="menu-button">...</button>
                      <div class="dropdown-menu">
                          <a href="#" class="rename-deck">Umbenennen</a>
                          <a href="#" class="delete-deck">LÃ¶schen</a>
                          <a href="#" class="add-cards">Karten hinzufÃ¼gen</a>
                      </div>
                  </div>
              </div>
              <ul class="sub-decks"></ul>
          `;
          document.getElementById('deck-list').appendChild(newDeck);
          addDeckEvents(newDeck);
          modal.style.display = 'none';
          deckNameInput.value = '';
      } else {
          alert('Bitte geben Sie einen Namen fÃ¼r den Stapel ein.');
      }
  });

  window.addEventListener('click', (event) => {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });

  function addDeckEvents(deck) {
      addDragAndDropEvents(deck);
      const toggle = deck.querySelector('.toggle');
      if (toggle) {
          addToggleEvent(toggle);
          checkForSubDecks(deck);
      }

      const renameLink = deck.querySelector('.rename-deck');
      const deleteLink = deck.querySelector('.delete-deck');

      renameLink.addEventListener('click', (e) => {
          e.preventDefault();
          const newName = prompt('Neuen Stapelnamen eingeben:');
          if (newName) {
              deck.querySelector('.deck-title').textContent = newName;
          }
      });

      deleteLink.addEventListener('click', (e) => {
          e.preventDefault();
          if (confirm('Sind Sie sicher, dass Sie diesen Stapel lÃ¶schen mÃ¶chten?')) {
              deck.remove();
          }
      });

      const addCardsLink = deck.querySelector('.add-cards');
      addCardsLink.addEventListener('click', (e) => {
          e.preventDefault();
          window.open('src/Kartenhinzufügen/Kartenhinzufügen.html', 'newWindow', 'width=800,height=600');
      });
  }

  function addDragAndDropEvents(deck) {
      deck.addEventListener('dragstart', (e) => {
          dragged = e.target;
          e.target.style.opacity = 0.5;
      });

      deck.addEventListener('dragend', (e) => {
          e.target.style.opacity = '';
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
          }
      });
  }

  function addToggleEvent(toggle) {
      toggle.addEventListener('click', (e) => {
          const deck = e.target.closest('.deck');
          const subDecks = deck.querySelector('.sub-decks');
          if (subDecks) {
              if (subDecks.classList.contains('show')) {
                  subDecks.classList.remove('show');
                  e.target.textContent = '+';
              } else {
                  subDecks.classList.add('show');
                  e.target.textContent = '-';
              }
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
});
