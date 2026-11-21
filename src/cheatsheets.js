/**
 * Fietes Merk-Karten (Cheat-Sheet reference dialog) with subject filter.
 */

import { cheatSheetCards } from '../data/cheatsheets.js';
import { escapeHtml } from './core/math.js';
import { $, $$ } from './core/ui.js';

let activeCheatFilter = 'all';

export function renderCheatSheets() {
  const grid = $('#cheatSheetGrid');
  if (!grid) return;

  const cards =
    activeCheatFilter === 'all'
      ? cheatSheetCards
      : cheatSheetCards.filter(card => card.subject === activeCheatFilter);

  grid.innerHTML = cards
    .map(
      card => `
      <article class="cheat-card" data-cheat-subject="${card.subject}">
        <span class="cheat-kicker">${escapeHtml(card.subjectLabel)}</span>
        <h3>${escapeHtml(card.title)}</h3>
        <div class="cheat-formula">${escapeHtml(card.formula)}</div>
        <p>${escapeHtml(card.body)}</p>
        <small>Beispiel: ${escapeHtml(card.example)}</small>
      </article>
    `
    )
    .join('');

  $$('[data-cheat-filter]').forEach(btn => {
    const active = btn.dataset.cheatFilter === activeCheatFilter;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

export function openCheatSheets(initialSubject = 'all') {
  if (['all', 'fractions', 'geometry', 'words', 'science', 'english'].includes(initialSubject)) {
    activeCheatFilter = initialSubject;
  }
  renderCheatSheets();
  const dialog = $('#cheatDialog');
  if (dialog && typeof dialog.showModal === 'function') {
    dialog.showModal();
  }
}

export function initCheatSheets() {
  $('#cheatButton')?.addEventListener('click', () => openCheatSheets('all'));
  $('#lessonCheatButton')?.addEventListener('click', () => openCheatSheets('all'));
  $('#cheatCloseButton')?.addEventListener('click', () => $('#cheatDialog')?.close());
  $('#cheatDoneButton')?.addEventListener('click', () => $('#cheatDialog')?.close());
  $('#cheatDialog')?.addEventListener('click', event => {
    if (event.target === $('#cheatDialog')) $('#cheatDialog')?.close();
  });

  $$('[data-cheat-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCheatFilter = btn.dataset.cheatFilter;
      renderCheatSheets();
    });
  });
}
