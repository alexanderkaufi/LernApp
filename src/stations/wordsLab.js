/**
 * German interactive station:
 * Mode 1: Wort-Lupe (click target words inside a sentence).
 * Mode 2: Hör-Diktat (listen to Fiete and spell the tricky target word accurately).
 */

import { wordScannerTasksByGrade, wordsDictationByGrade } from '../../data/words.js';
import { escapeHtml } from '../core/math.js';
import { playTone, speakText } from '../core/audio.js';
import { getProgress, recordActivity, recordSubjectLabSolved } from '../core/store.js';
import { $, $$, setStationTutor, showToast } from '../core/ui.js';

let wordsMode = 'scanner';
let wordTaskIndex = 0;
let dictationIndex = 0;
let selectedIndices = new Set();
let checkedCurrent = false;

export function evaluateWordSelection(selected, targets) {
  const targetSet = new Set(targets);
  const selectedArr = [...selected];
  const exact =
    selectedArr.length === targetSet.size && selectedArr.every(idx => targetSet.has(idx));
  const missingCount = targets.filter(idx => !selected.has(idx)).length;
  const extraCount = selectedArr.filter(idx => !targetSet.has(idx)).length;
  return { exact, missingCount, extraCount };
}

export function evaluateDictationAnswer(userInput, targetWord) {
  return String(userInput || '').trim() === String(targetWord || '').trim();
}

function getCurrentWordTask() {
  const grade = getProgress().selectedGrade || 5;
  const list = wordScannerTasksByGrade[grade] || wordScannerTasksByGrade[5];
  return { list, task: list[wordTaskIndex % list.length] };
}

function getCurrentDictationTask() {
  const grade = getProgress().selectedGrade || 5;
  const list = wordsDictationByGrade[grade] || wordsDictationByGrade[5];
  return { list, task: list[dictationIndex % list.length] };
}

function toggleWordChip(index) {
  if (checkedCurrent) return;
  if (selectedIndices.has(index)) {
    selectedIndices.delete(index);
  } else {
    selectedIndices.add(index);
  }
  const chip = $(`[data-word-index="${index}"]`, $('#wordsSentenceRow'));
  if (chip) {
    const active = selectedIndices.has(index);
    chip.classList.toggle('selected', active);
    chip.setAttribute('aria-pressed', String(active));
  }
  playTone(460 + index * 20, 0.08, getProgress().soundOn);
}

function renderWordsModeSwitch() {
  const scannerBox = $('#wordsScannerBox');
  const dictBox = $('#wordsDictationBox');
  if (scannerBox) scannerBox.classList.toggle('hidden', wordsMode !== 'scanner');
  if (dictBox) dictBox.classList.toggle('hidden', wordsMode !== 'dictation');

  $$('[data-words-mode]').forEach(btn => {
    const active = btn.dataset.wordsMode === wordsMode;
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', String(active));
  });
}

export function renderWordsTask() {
  selectedIndices = new Set();
  checkedCurrent = false;
  const { task } = getCurrentWordTask();
  const solved = getProgress().labChallengesSolved.includes(task.id);

  if ($('#wordsTaskPrompt')) $('#wordsTaskPrompt').textContent = task.prompt;
  if ($('#wordsTaskStatus')) {
    $('#wordsTaskStatus').textContent = solved ? '✓ Geschafft' : 'Offen';
    $('#wordsTaskStatus').className = `challenge-status ${solved ? 'done' : ''}`;
  }

  const row = $('#wordsSentenceRow');
  if (row) {
    row.innerHTML = task.words
      .map(
        (word, idx) =>
          `<button type="button" class="word-chip" data-word-index="${idx}" aria-pressed="false">${escapeHtml(word)}</button>`
      )
      .join('');

    $$('[data-word-index]', row).forEach(btn => {
      const idx = Number(btn.dataset.wordIndex);
      btn.addEventListener('click', () => toggleWordChip(idx));
    });
  }

  const fb = $('#wordsLabFeedback');
  if (fb) fb.className = 'station-feedback';
}

export function renderDictationTask() {
  const { task } = getCurrentDictationTask();
  const solved = getProgress().labChallengesSolved.includes(task.id);

  if ($('#dictationMaskedText')) $('#dictationMaskedText').textContent = task.masked;
  if ($('#dictationClueText')) $('#dictationClueText').textContent = `Hinweis: ${task.clue}`;
  if ($('#dictationStatus')) {
    $('#dictationStatus').textContent = solved ? '✓ Geschafft' : 'Offen';
    $('#dictationStatus').className = `challenge-status ${solved ? 'done' : ''}`;
  }
  const input = $('#dictationInput');
  if (input) {
    input.value = '';
    input.disabled = false;
    input.className = '';
  }
  const fb = $('#dictationFeedback');
  if (fb) fb.className = 'station-feedback';
}

function checkWordsTask() {
  const { task } = getCurrentWordTask();
  const result = evaluateWordSelection(selectedIndices, task.targets);
  const fb = $('#wordsLabFeedback');
  const soundOn = getProgress().soundOn;

  if (result.exact) {
    checkedCurrent = true;
    const targetSet = new Set(task.targets);
    $$('[data-word-index]', $('#wordsSentenceRow')).forEach(btn => {
      const idx = Number(btn.dataset.wordIndex);
      btn.classList.toggle('correct', targetSet.has(idx));
    });

    const isNew = recordSubjectLabSolved('words', task.id);
    fb.className = 'station-feedback show success';
    fb.textContent = `${task.tip}${isNew ? ' +15 XP' : ''}`;
    setStationTutor('Adlerauge! Genau die richtigen Wörter gefunden.', 'celebrating');
    if ($('#wordsTaskStatus')) {
      $('#wordsTaskStatus').textContent = '✓ Geschafft';
      $('#wordsTaskStatus').className = 'challenge-status done';
    }
    playTone(700, 0.18, soundOn);
  } else {
    recordActivity();
    fb.className = 'station-feedback show try-again';
    if (selectedIndices.size === 0) {
      fb.textContent = 'Klicke zuerst ein oder mehrere Wörter im Satz an.';
    } else if (result.extraCount > 0) {
      fb.textContent = `Fast! ${result.extraCount} markiertes Wort passt noch nicht ganz. Prüfe nochmal genau.`;
    } else {
      fb.textContent = `Schon auf der richtigen Spur! Es fehlt noch mindestens ${result.missingCount} Wort.`;
    }
    setStationTutor('Tipp: Lies den Satz Wort für Wort durch und wende die Kontrollfrage an.', 'thinking');
    playTone(260, 0.18, soundOn);
  }
}

function checkDictationTask(rawValue) {
  const { task } = getCurrentDictationTask();
  const trimmed = String(rawValue || '').trim();
  const fb = $('#dictationFeedback');
  const soundOn = getProgress().soundOn;

  if (!trimmed) {
    showToast('✏️ Wort fehlt', 'Tippe das fehlende Wort aus dem Satz ein.');
    return;
  }

  const exact = evaluateDictationAnswer(trimmed, task.target);
  const input = $('#dictationInput');

  if (exact) {
    if (input) {
      input.disabled = true;
      input.classList.add('input-correct');
    }
    const isNew = recordSubjectLabSolved('dictation', task.id);
    fb.className = 'station-feedback show success';
    fb.textContent = `Richtig geschrieben: „${task.target}“!${isNew ? ' +15 XP' : ''}`;
    setStationTutor('Rechtschreib-Volltreffer! Sogar Groß-/Kleinschreibung sitzt.', 'celebrating');
    if ($('#dictationStatus')) {
      $('#dictationStatus').textContent = '✓ Geschafft';
      $('#dictationStatus').className = 'challenge-status done';
    }
    playTone(700, 0.18, soundOn);
  } else {
    recordActivity();
    if (input) input.classList.add('input-wrong');
    const caseIssue = trimmed.toLowerCase() === task.target.toLowerCase();
    fb.className = 'station-feedback show try-again';
    fb.textContent = caseIssue
      ? `Die Buchstaben stimmen schon – achte nur genau auf Groß- und Kleinschreibung! (${task.clue})`
      : `Noch nicht ganz: Schau dir den Hinweis an (${task.clue}) oder lass dir den Satz noch einmal vorlesen.`;
    setStationTutor('Achte auf Dehnung, Doppelbuchstaben und Groß-/Kleinschreibung.', 'thinking');
    playTone(260, 0.18, soundOn);
  }
}

export function resetWordsLabForGrade() {
  wordTaskIndex = 0;
  dictationIndex = 0;
  renderWordsModeSwitch();
  renderWordsTask();
  renderDictationTask();
}

export function initWordsLab({ onStartQuiz } = {}) {
  $$('[data-words-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      wordsMode = btn.dataset.wordsMode;
      renderWordsModeSwitch();
    });
  });

  $('#wordsCheckButton')?.addEventListener('click', checkWordsTask);
  $('#wordsNextButton')?.addEventListener('click', () => {
    wordTaskIndex += 1;
    renderWordsTask();
  });

  $('#dictationSpeakButton')?.addEventListener('click', event => {
    const { task } = getCurrentDictationTask();
    speakText(task.sentence, {
      lang: 'de-DE',
      soundOn: getProgress().soundOn,
      button: event.currentTarget,
      onSoundDisabled: showToast
    });
  });

  $('#dictationForm')?.addEventListener('submit', event => {
    event.preventDefault();
    checkDictationTask($('#dictationInput')?.value || '');
  });

  $('#dictationNextButton')?.addEventListener('click', () => {
    dictationIndex += 1;
    renderDictationTask();
  });

  $('#wordsQuizStartButton')?.addEventListener('click', () => {
    if (typeof onStartQuiz === 'function') onStartQuiz('words');
  });

  resetWordsLabForGrade();
}
