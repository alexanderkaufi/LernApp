/**
 * English interactive studio: listen to native-lang TTS pronunciation
 * and solve grade-specific grammar/vocabulary prompts.
 */

import { englishStudioTasksByGrade } from '../../data/english.js';
import { escapeHtml } from '../core/math.js';
import { playTone, speakText } from '../core/audio.js';
import { getProgress, recordActivity, recordSubjectLabSolved } from '../core/store.js';
import { $, $$, setStationTutor, showToast } from '../core/ui.js';

let englishTaskIndex = 0;
let selectedOption = null;
let answeredCurrent = false;

function getCurrentEnglishTask() {
  const grade = getProgress().selectedGrade || 5;
  const list = englishStudioTasksByGrade[grade] || englishStudioTasksByGrade[5];
  return { list, task: list[englishTaskIndex % list.length] };
}

export function renderEnglishTask() {
  selectedOption = null;
  answeredCurrent = false;
  const { task } = getCurrentEnglishTask();
  const solved = getProgress().labChallengesSolved.includes(task.id);

  if ($('#englishTaskPrompt')) $('#englishTaskPrompt').textContent = task.prompt;
  if ($('#englishSentenceBox')) $('#englishSentenceBox').textContent = task.sentence;
  if ($('#englishTaskStatus')) {
    $('#englishTaskStatus').textContent = solved ? '✓ Geschafft' : 'Offen';
    $('#englishTaskStatus').className = `challenge-status ${solved ? 'done' : ''}`;
  }

  const row = $('#englishOptionsRow');
  if (row) {
    row.innerHTML = task.options
      .map(
        opt =>
          `<button type="button" class="answer-button" data-english-option="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`
      )
      .join('');
    $$('[data-english-option]', row).forEach(btn => {
      btn.addEventListener('click', () => handleEnglishOption(btn));
    });
  }

  const fb = $('#englishLabFeedback');
  if (fb) fb.className = 'station-feedback';
}

function handleEnglishOption(clickedButton) {
  if (answeredCurrent) return;
  answeredCurrent = true;
  selectedOption = clickedButton.dataset.englishOption;

  const { task } = getCurrentEnglishTask();
  const correct = selectedOption === task.correct;
  const fb = $('#englishLabFeedback');
  const soundOn = getProgress().soundOn;

  $$('[data-english-option]', $('#englishOptionsRow')).forEach(btn => {
    btn.disabled = true;
    const val = btn.dataset.englishOption;
    if (btn === clickedButton) {
      btn.classList.add('selected', correct ? 'correct' : 'wrong');
    } else if (!correct && val === task.correct) {
      btn.classList.add('reveal');
    }
  });

  if (correct) {
    const isNew = recordSubjectLabSolved('english', task.id);
    fb.className = 'station-feedback show success';
    fb.textContent = `${task.tip}${isNew ? ' +15 XP' : ''}`;
    setStationTutor('Great job! Du hörst und kombinierst auf Englisch schon richtig sicher.', 'celebrating');
    if ($('#englishTaskStatus')) {
      $('#englishTaskStatus').textContent = '✓ Geschafft';
      $('#englishTaskStatus').className = 'challenge-status done';
    }
    playTone(700, 0.18, soundOn);
  } else {
    recordActivity();
    fb.className = 'station-feedback show try-again';
    fb.textContent = `Fast! Richtig ist »${task.correct}«. ${task.tip}`;
    setStationTutor('Kein Problem – hör dir den Satz oben noch einmal mit dem Lautsprecher an!', 'thinking');
    playTone(260, 0.18, soundOn);
  }
}

export function resetEnglishLabForGrade() {
  englishTaskIndex = 0;
  renderEnglishTask();
}

export function initEnglishLab({ onStartQuiz } = {}) {
  $('#englishSpeakButton')?.addEventListener('click', event => {
    const { task } = getCurrentEnglishTask();
    speakText(task.speakSentence, {
      lang: 'en-GB',
      soundOn: getProgress().soundOn,
      button: event.currentTarget,
      onSoundDisabled: showToast
    });
  });

  $('#englishNextButton')?.addEventListener('click', () => {
    englishTaskIndex += 1;
    renderEnglishTask();
  });

  $('#englishQuizStartButton')?.addEventListener('click', () => {
    if (typeof onStartQuiz === 'function') onStartQuiz('english');
  });

  renderEnglishTask();
}
