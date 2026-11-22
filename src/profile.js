/**
 * Multi-profile switcher, cross-subject diagnostics, printable report,
 * JSON export/import, and safe reset dialog.
 */

import { escapeHtml } from './core/math.js';
import {
  DAILY_GOAL_XP,
  MAX_PROFILES,
  badgeDefinitions,
  exportProgressJSON,
  formatLearningReportText,
  getInitials,
  getLevelInfo,
  getTodayXp
} from './core/state.js';
import {
  createNewProfile,
  getProgress,
  getVaultSnapshot,
  importProgressData,
  removeProfile,
  resetAllProgress,
  selectProfile,
  setUserName
} from './core/store.js';
import { $, $$, showToast } from './core/ui.js';

let confirmingReset = false;

function renderProfileSwitcher(onProfileChange) {
  const container = $('#profileSwitcherList');
  if (!container) return;

  const { activeProfileId, profiles } = getVaultSnapshot();
  container.innerHTML = profiles
    .map(p => {
      const active = p.id === activeProfileId;
      const displayName = p.userName || 'Mein Lernprofil';
      return `<button type="button" class="profile-pill-btn ${active ? 'active' : ''}" data-profile-id="${escapeHtml(p.id)}" aria-pressed="${active}"><b>${escapeHtml(getInitials(p.userName))}</b><span>${escapeHtml(displayName)} (Kl. ${p.selectedGrade} · ${p.totalXp} XP)</span></button>`;
    })
    .join('');

  $$('[data-profile-id]', container).forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.profileId;
      if (selectProfile(id)) {
        renderProfileDialog(onProfileChange);
        if (typeof onProfileChange === 'function') onProfileChange();
        const nextName = getProgress().userName;
        showToast('👤 Profil gewechselt', nextName ? `Willkommen zurück, ${nextName}!` : 'Aktives Lernprofil geladen.');
      }
    });
  });

  const deleteBtn = $('#profileDeleteButton');
  if (deleteBtn) {
    deleteBtn.hidden = profiles.length <= 1;
  }
  const newForm = $('#newProfileForm');
  if (newForm) {
    newForm.classList.toggle('hidden', profiles.length >= MAX_PROFILES);
  }
}

export function renderProfileDialog(onProfileChange) {
  const progress = getProgress();
  const grade = progress.selectedGrade || 5;
  const levelInfo = getLevelInfo(progress.totalXp);
  const todayXp = getTodayXp(progress);

  renderProfileSwitcher(onProfileChange);

  const nameInput = $('#profileNameInput');
  if (nameInput) nameInput.value = progress.userName || '';

  const statsEl = $('#profileStatsGrid');
  if (statsEl) {
    statsEl.innerHTML = `
      <div><strong>Lv. ${levelInfo.level}</strong><span>${levelInfo.title}</span></div>
      <div><strong>${todayXp}/${DAILY_GOAL_XP}</strong><span>Heute XP</span></div>
      <div><strong>${progress.streakDays}</strong><span>Tage Serie</span></div>
      <div><strong>${progress.badges.length}/${badgeDefinitions.length}</strong><span>Abzeichen</span></div>
    `;
  }

  const gradeListEl = $('#profileGradesGrid');
  if (gradeListEl) {
    const bySubject = progress.bestCorrectBySubject || {};
    gradeListEl.innerHTML = `
      <div class="grade-stat-pill"><small>Brüche (Kl. ${grade})</small><strong>${bySubject.fractions?.[grade] || 0}/10</strong></div>
      <div class="grade-stat-pill"><small>Geometrie (Kl. ${grade})</small><strong>${bySubject.geometry?.[grade] || 0}/6</strong></div>
      <div class="grade-stat-pill"><small>Deutsch (Kl. ${grade})</small><strong>${bySubject.words?.[grade] || 0}/6</strong></div>
      <div class="grade-stat-pill"><small>Englisch (Kl. ${grade})</small><strong>${bySubject.english?.[grade] || 0}/6</strong></div>
      <div class="grade-stat-pill"><small>Energie (Kl. ${grade})</small><strong>${bySubject.science?.[grade] || 0}/6</strong></div>
    `;
  }

  const topicBox = $('#profileTopicsBox');
  if (topicBox) {
    const topicEntries = Object.entries(progress.topicStatsByGrade?.[grade] || {});
    if (topicEntries.length === 0) {
      topicBox.innerHTML = `<p class="profile-empty">Starte ein Quiz in Klasse ${grade}, um deine Stärken pro Themengebiet zu sehen.</p>`;
    } else {
      topicBox.innerHTML = topicEntries
        .map(([topic, stat]) => {
          const pct = Math.round((stat.correct / Math.max(1, stat.total)) * 100);
          return `<div class="topic-stat-row"><span>${escapeHtml(topic)}</span><div class="topic-bar"><i style="width:${pct}%"></i></div><b>${stat.correct}/${stat.total}</b></div>`;
        })
        .join('');
    }
  }

  confirmingReset = false;
  const resetBtn = $('#profileResetButton');
  const cancelResetBtn = $('#profileResetCancel');
  if (resetBtn) resetBtn.textContent = 'Lernstand zurücksetzen';
  if (cancelResetBtn) cancelResetBtn.hidden = true;
  const reportPreview = $('#profileReportPreview');
  if (reportPreview) {
    reportPreview.hidden = true;
    reportPreview.textContent = '';
  }
}

export function openProfileDialog(onProfileChange) {
  renderProfileDialog(onProfileChange);
  const dialog = $('#profileDialog');
  if (dialog && typeof dialog.showModal === 'function') {
    dialog.showModal();
  }
}

function downloadBackup() {
  const json = exportProgressJSON(getProgress());
  if (typeof Blob === 'undefined' || typeof URL === 'undefined' || typeof document === 'undefined') {
    return;
  }
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'kluug-lernstand.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast('💾 Lernstand gesichert', 'Die Datei kluug-lernstand.json wurde heruntergeladen.');
}

function handleImportFile(event, onImport) {
  const file = event.target?.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result || '{}'));
      importProgressData(parsed);
      renderProfileDialog(onImport);
      if (typeof onImport === 'function') onImport();
      showToast('📥 Lernstand geladen', 'Dein gespeicherter Fortschritt wurde übernommen.');
    } catch (_) {
      showToast('⚠️ Datei ungültig', 'Bitte wähle eine gültige KLUUG-Backup-Datei (.json).');
    } finally {
      event.target.value = '';
    }
  };
  reader.readAsText(file);
}

function printWeeklyReport() {
  const progress = getProgress();
  const sheet = $('#printReportSheet');
  if (sheet) {
    const dateStr = new Date().toLocaleDateString('de-DE');
    const summaryText = formatLearningReportText(progress);
    sheet.innerHTML = `
      <h1>KLUUG – Wochen- &amp; Lernbericht</h1>
      <p class="print-meta">Erstellt am ${escapeHtml(dateStr)} · Profil: ${escapeHtml(progress.userName || 'Mein Lernprofil')}</p>
      <pre>${escapeHtml(summaryText)}</pre>
    `;
  }
  if (typeof window !== 'undefined' && typeof window.print === 'function') {
    window.print();
  }
}

export function initProfileDialog({ onReset, onImport, onProfileChange } = {}) {
  const dialog = $('#profileDialog');
  const notifyChange = onProfileChange || onReset;

  $('#profileButton')?.addEventListener('click', () => openProfileDialog(notifyChange));
  $('#profileCloseButton')?.addEventListener('click', () => dialog?.close());
  $('#profileDoneButton')?.addEventListener('click', () => dialog?.close());

  dialog?.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });

  $('#profileNameForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const updated = setUserName($('#profileNameInput')?.value);
    renderProfileSwitcher(notifyChange);
    showToast('👤 Profil gespeichert', updated ? `Schön, dass du da bist, ${updated}!` : 'Profil aktualisiert.');
  });

  $('#newProfileForm')?.addEventListener('submit', event => {
    event.preventDefault();
    const input = $('#newProfileNameInput');
    const rawName = input?.value?.trim();
    if (!rawName) return;
    try {
      createNewProfile(rawName, getProgress().selectedGrade || 5);
      if (input) input.value = '';
      renderProfileDialog(notifyChange);
      if (typeof notifyChange === 'function') notifyChange();
      showToast('✨ Neues Profil erstellt', `Hallo ${rawName}! Viel Spaß mit KLUUG.`);
    } catch (err) {
      showToast('⚠️ Hinweis', err.message);
    }
  });

  $('#profileDeleteButton')?.addEventListener('click', () => {
    const { activeProfileId, profiles } = getVaultSnapshot();
    if (profiles.length <= 1) return;
    const removedName = getProgress().userName || 'Lernprofil';
    if (removeProfile(activeProfileId)) {
      renderProfileDialog(notifyChange);
      if (typeof notifyChange === 'function') notifyChange();
      showToast('🗑️ Profil entfernt', `Profil „${removedName}“ wurde gelöscht.`);
    }
  });

  $('#profileExportButton')?.addEventListener('click', downloadBackup);
  $('#profileImportButton')?.addEventListener('click', () => $('#profileImportInput')?.click());
  $('#profileImportInput')?.addEventListener('change', event => handleImportFile(event, onImport));
  $('#profilePrintButton')?.addEventListener('click', printWeeklyReport);

  $('#profileReportButton')?.addEventListener('click', () => {
    const reportText = formatLearningReportText(getProgress());
    const preview = $('#profileReportPreview');
    if (preview) {
      preview.textContent = reportText;
      preview.hidden = false;
    }
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(reportText)
        .then(() => showToast('📋 Lernbericht kopiert', 'Du kannst ihn jetzt direkt einfügen oder teilen.'))
        .catch(() => showToast('📋 Lernbericht erstellt', 'Du kannst den Text unten markieren und kopieren.'));
    } else {
      showToast('📋 Lernbericht erstellt', 'Sieh dir die Zusammenfassung unten an.');
    }
  });

  $('#profileResetButton')?.addEventListener('click', () => {
    const resetBtn = $('#profileResetButton');
    const cancelBtn = $('#profileResetCancel');
    if (!confirmingReset) {
      confirmingReset = true;
      resetBtn.textContent = 'Ja, wirklich alles zurücksetzen';
      if (cancelBtn) cancelBtn.hidden = false;
      return;
    }

    resetAllProgress();
    renderProfileDialog(notifyChange);
    if (typeof onReset === 'function') onReset();
    showToast('↺ Lernstand zurückgesetzt', 'Alles bereit für einen frischen Start!');
  });

  $('#profileResetCancel')?.addEventListener('click', () => {
    confirmingReset = false;
    $('#profileResetButton').textContent = 'Lernstand zurücksetzen';
    $('#profileResetCancel').hidden = true;
  });
}
