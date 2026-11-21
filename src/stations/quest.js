/**
 * Multi-subject Quiz-Quest engine, Lesson View, Profi free-input mode,
 * focus training, keyboard shortcuts (1-3 / Enter), topic diagnostics, and Retry.
 */

import { prepareQuestionWithShuffledAnswers } from '../../data/fractions.js';
import {
  buildSubjectQuizSession,
  buildTopicFocusSession,
  subjectCatalog
} from '../../data/subjects.js';
import {
  escapeHtml,
  expressionHTML,
  formatSentenceMarkup,
  fractionHTML,
  isFreeInputEligible,
  isFreeInputMatch
} from '../core/math.js';
import { playChime, playTone, speakText } from '../core/audio.js';
import {
  awardXp,
  getProgress,
  recordActivity,
  recordProfiSolved,
  recordQuizCompletion,
  recordTopicResult,
  setLastSubject,
  setProfiMode,
  unlockBadge,
  visitStation
} from '../core/store.js';
import { $, $$, reactWithFiete, setLessonTutor, showToast, showView } from '../core/ui.js';
import { renderGeometryQuestionSvg } from './geometryLab.js';

export { formatSentenceMarkup };

let activeSubjectId = 'fractions';
let questions = [];
let currentQuestion = 0;
let score = 0;
let correctCount = 0;
let currentStreak = 0;
let bestStreak = 0;
let answered = false;
let isRetryRound = false;
let isFocusRound = false;
let focusTopicName = '';
let missedQuestions = [];
let roundTopicBreakdown = {};

const tutorPrompts = [
  'Bleib neugierig – jeder Versuch macht dich sicherer.',
  'Oha, jetzt wird es spannend! Denk in kleinen Schritten.',
  'Schon im Rhythmus! Dein Gehirn ist warmgelaufen.',
  'Fast Halbzeit – bleib locker und schau genau hin.',
  'Halbzeit! Atme kurz durch. Du machst das richtig gut.',
  'Jetzt kommt dein Wissen richtig in Fahrt!',
  'Nur noch wenige Aufgaben. Fehler sind willkommen!',
  'Fast geschafft – du bist stärker als am Anfang.',
  'Finale! Zeig der letzten Aufgabe, was du kannst.'
];

export function renderQuestMap() {
  const progress = getProgress();
  const grade = progress.selectedGrade || 5;
  const bestCorrect = Math.min(
    10,
    Math.max(0, Number(progress.bestCorrectBySubject?.fractions?.[grade]) || 0)
  );

  const map = $('#questMap');
  if (map) {
    const items = [];
    for (let i = 1; i <= 10; i++) {
      const stateClass = i <= bestCorrect ? 'done' : i === bestCorrect + 1 ? 'current' : '';
      items.push(`<i class="${stateClass}">${i}</i>`);
      if (i < 10) items.push(`<b class="${i < bestCorrect ? 'done' : ''}"></b>`);
    }
    map.innerHTML = items.join('');
  }

  const bestLabel = $('#questBestScore');
  if (bestLabel) {
    bestLabel.textContent =
      bestCorrect > 0
        ? `Bestleistung in Klasse ${grade}: ${bestCorrect}/10 Missionen`
        : `Noch keine Runde in Klasse ${grade} abgeschlossen`;
  }
}

export function syncProfiToggleUI() {
  const isProfi = Boolean(getProgress().profiMode);
  const btn = $('#profiModeToggle');
  if (btn) {
    btn.classList.toggle('active', isProfi);
    btn.setAttribute('aria-pressed', String(isProfi));
    btn.textContent = isProfi ? '🎯 Profi-Eingabe: An' : '🎯 Profi-Eingabe: Aus';
  }
}

function renderVisual(question) {
  const visual = $('#visualQuestion');
  if (!visual) return;

  if (question.visual === 'tiles') {
    visual.innerHTML = `<div class="fraction-grid" style="--cols:${question.cols}">${Array.from(
      { length: question.total },
      (_, index) => `<span class="fraction-tile ${index < question.filled ? 'filled' : ''}"></span>`
    ).join('')}</div>`;
  } else if (question.visual === 'number') {
    visual.innerHTML = fractionHTML(question.fraction);
  } else if (question.visual === 'expression') {
    visual.innerHTML = `<div class="math-expression">${expressionHTML(question.equation)}</div>`;
  } else if (question.visual === 'svgShape') {
    visual.innerHTML = `<div class="svg-question-wrap">${renderGeometryQuestionSvg(question)}</div>`;
  } else if (question.visual === 'sentence') {
    visual.innerHTML = `<div class="sentence-question-card">${formatSentenceMarkup(question.sentence)}</div>`;
  } else if (question.visual === 'scienceFlow') {
    visual.innerHTML = `<div class="science-flow-card"><span>${escapeHtml(question.from)}</span><b>→</b><span>${escapeHtml(question.to)}</span></div>`;
  } else if (question.visual === 'englishCard') {
    visual.innerHTML = `
      <div class="english-question-card">
        <p>${escapeHtml(question.phrase)}</p>
        <button type="button" class="secondary-pill-button" id="questionEnglishListenButton">🔊 Anhören (EN)</button>
      </div>
    `;
    $('#questionEnglishListenButton', visual)?.addEventListener('click', event => {
      speakText(question.speakText || question.phrase, {
        lang: 'en-GB',
        soundOn: getProgress().soundOn,
        button: event.currentTarget,
        onSoundDisabled: showToast
      });
    });
  } else {
    const sign = question.visual === 'compareEqual' ? '=' : 'oder';
    const rightHtml =
      question.fractions[1] === '?' ? '<div class="fraction-number">?</div>' : fractionHTML(question.fractions[1]);
    visual.innerHTML = `<div class="fraction-display">${fractionHTML(question.fractions[0])}<span class="compare-sign">${sign}</span>${rightHtml}</div>`;
  }
}

function formatAnswerContent(answer) {
  const text = String(answer).trim();
  const isPureFraction = /^([−-]?\s*\d+\s+\d+\/\d+|[−-]?\s*[\dA-Za-z²³?]+\/[\dA-Za-z²³?]+)$/.test(text);
  if (isPureFraction && !text.includes('km/h') && !text.includes('Wh/h')) {
    return fractionHTML(text);
  }
  return `<span>${escapeHtml(text)}</span>`;
}

function renderAnswerArea(question) {
  const progress = getProgress();
  const useFreeInput = Boolean(progress.profiMode && isFreeInputEligible(question));
  const answersEl = $('#answers');
  if (!answersEl) return;

  if (useFreeInput) {
    answersEl.className = 'answers free-input-mode';
    answersEl.innerHTML = `
      <form class="free-input-form" id="freeInputForm">
        <div class="free-input-row">
          <input id="freeAnswerInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Antwort eingeben (z. B. 3/4 oder 12)" aria-label="Deine Antwort eingeben" />
          <button class="primary-button compact-btn" id="freeSubmitButton" type="submit">Prüfen</button>
        </div>
        <div class="math-keypad" aria-label="Mathe-Schnelltasten">
          <button type="button" data-insert-char="/">/</button>
          <button type="button" data-insert-char="−">−</button>
          <button type="button" data-insert-char=",">,</button>
          <button type="button" data-insert-char="x">x</button>
          <button type="button" data-insert-char=" %">%</button>
          <button type="button" data-insert-char="°">°</button>
          <button type="button" data-insert-char=" cm²">cm²</button>
          <button type="button" data-insert-char=" Ω">Ω</button>
        </div>
      </form>
    `;

    const input = $('#freeAnswerInput', answersEl);
    $$('[data-insert-char]', answersEl).forEach(btn => {
      btn.addEventListener('click', () => {
        if (!input || input.disabled) return;
        const ch = btn.dataset.insertChar;
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        input.value = `${input.value.slice(0, start)}${ch}${input.value.slice(end)}`;
        const pos = start + ch.length;
        input.focus();
        if (typeof input.setSelectionRange === 'function') {
          input.setSelectionRange(pos, pos);
        }
      });
    });

    $('#freeInputForm', answersEl)?.addEventListener('submit', event => {
      event.preventDefault();
      checkFreeInputAnswer(input?.value || '');
    });

    if (input && typeof input.focus === 'function') {
      requestAnimationFrame(() => input.focus());
    }
    return;
  }

  answersEl.className = 'answers';
  answersEl.innerHTML = question.answers
    .map((answer, index) => {
      return `<button class="answer-button" data-answer="${index}"><kbd class="answer-key" aria-hidden="true">${index + 1}</kbd>${formatAnswerContent(answer)}</button>`;
    })
    .join('');

  $$('[data-answer]', answersEl).forEach(button => {
    button.addEventListener('click', () => checkAnswer(Number(button.dataset.answer)));
  });
}

function renderQuestion() {
  answered = false;
  const progress = getProgress();
  const grade = progress.selectedGrade || 5;
  const subject = subjectCatalog[activeSubjectId] || subjectCatalog.fractions;
  const question = questions[currentQuestion];

  $('#lessonLevelLabel').textContent = isRetryRound
    ? `ZWEITE CHANCE · ${subject.kicker} · KLASSE ${grade}`
    : isFocusRound
      ? `FOKUS-TRAINING · ${focusTopicName.toUpperCase()} · KLASSE ${grade}`
      : `${subject.kicker} · KLASSE ${grade} · ${subject.getGradeLevel(grade)}`;
  $('#roundLabel').textContent = `${currentQuestion + 1} / ${questions.length}`;
  $('#lessonProgressBar').style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;

  $('#exerciseType').textContent = question.type;
  $('#lessonTitle').textContent = question.title;
  $('#exerciseHint').textContent = question.hint;
  syncProfiToggleUI();

  if (isRetryRound) {
    setLessonTutor('Zweite Chance! Schau dir die Aufgabe in Ruhe noch einmal an.', 'happy');
  } else if (isFocusRound) {
    setLessonTutor(`Fokus auf „${focusTopicName}“ – genau hier wirst du heute richtig stark!`, 'happy');
  } else if (currentQuestion === 0) {
    setLessonTutor(subject.getIntro(grade), 'happy');
  } else if (currentQuestion === questions.length - 1) {
    setLessonTutor(tutorPrompts[tutorPrompts.length - 1], 'happy');
  } else {
    setLessonTutor(tutorPrompts[(currentQuestion - 1) % (tutorPrompts.length - 1)], 'happy');
  }

  $('#feedback').className = 'feedback';
  renderVisual(question);
  renderAnswerArea(question);
}

function applyQuestionOutcome(correct, { xpGain, expectedSolution = null }) {
  const progress = getProgress();
  const grade = progress.selectedGrade || 5;
  const question = questions[currentQuestion];

  const topic = question.topic || question.type;
  const topicBucket = roundTopicBreakdown[topic] || { correct: 0, total: 0 };
  topicBucket.total += 1;
  if (correct) topicBucket.correct += 1;
  roundTopicBreakdown[topic] = topicBucket;
  recordTopicResult(grade, topic, correct);

  const feedback = $('#feedback');
  feedback.classList.add('show');

  if (correct) {
    score += xpGain;
    correctCount += 1;
    currentStreak += 1;
    bestStreak = Math.max(bestStreak, currentStreak);
    recordActivity();

    $('#feedbackIcon').textContent = '✓';
    $('#feedbackTitle').textContent = [
      'Yes! Genau richtig!',
      'Klasse gedacht!',
      'Bäm – du hast es!',
      'Super aufgepasst!'
    ][currentQuestion % 4];
    $('#feedbackText').textContent = `+${xpGain} XP · ${question.tip}`;
    setLessonTutor(
      currentStreak > 1 ? `${currentStreak} am Stück! Du bist im Flow! 🔥` : 'Siehst du? Dein Kopf kann das!',
      'celebrating'
    );
    if (currentStreak >= 3) unlockBadge('streak');
    playTone(560, 0.18, progress.soundOn);
  } else {
    currentStreak = 0;
    missedQuestions.push(question);
    recordActivity();

    feedback.classList.add('wrong');
    $('#feedbackIcon').textContent = '↻';
    $('#feedbackTitle').textContent = 'Fast! Kein Problem.';
    $('#feedbackText').textContent = expectedSolution
      ? `Lösung: ${expectedSolution} · ${question.tip}`
      : question.tip;
    setLessonTutor('Fehler sind Trainingspunkte fürs Gehirn. Schau dir die Erklärung genau an!', 'sad');
    playTone(250, 0.18, progress.soundOn);
  }

  $('#scoreValue').textContent = score;
  $('#lessonStreak').textContent = currentStreak;
  if ($('#lessonStreakMobile')) $('#lessonStreakMobile').textContent = currentStreak;
}

function checkFreeInputAnswer(rawInput) {
  if (answered) return;
  const trimmed = String(rawInput || '').trim();
  if (!trimmed) {
    showToast('✏️ Eingabe fehlt', 'Tippe erst deine Lösung ein.');
    return;
  }

  answered = true;
  const question = questions[currentQuestion];
  const expected = question.answers[question.correct];
  const correct = isFreeInputMatch(trimmed, expected, question.acceptedInputs);

  const input = $('#freeAnswerInput');
  const submitBtn = $('#freeSubmitButton');
  if (input) {
    input.disabled = true;
    input.classList.add(correct ? 'input-correct' : 'input-wrong');
  }
  if (submitBtn) submitBtn.disabled = true;
  $$('[data-insert-char]', $('#answers')).forEach(btn => {
    btn.disabled = true;
  });

  if (correct) recordProfiSolved();
  applyQuestionOutcome(correct, {
    xpGain: isRetryRound ? 15 : 30,
    expectedSolution: expected
  });
}

function checkAnswer(index) {
  if (answered) return;
  const buttons = $$('.answer-button', $('#answers'));
  if (!buttons[index]) return;
  answered = true;

  const question = questions[currentQuestion];
  const correct = index === question.correct;

  buttons.forEach(button => {
    button.disabled = true;
  });
  buttons[index].classList.add('selected', correct ? 'correct' : 'wrong');
  if (!correct) buttons[question.correct].classList.add('reveal');

  applyQuestionOutcome(correct, { xpGain: isRetryRound ? 10 : 20 });
}

function createConfetti() {
  const confetti = $('#confetti');
  if (!confetti) return;
  confetti.innerHTML = Array.from({ length: 35 }, (_, index) => {
    return `<i style="left:${(index * 37) % 100}%;animation-delay:${(index % 10) * 0.12}s;transform:rotate(${index * 17}deg)"></i>`;
  }).join('');
}

function renderResultSummary() {
  const breakdownEl = $('#resultTopics');
  if (breakdownEl) {
    const entries = Object.entries(roundTopicBreakdown);
    breakdownEl.innerHTML = entries
      .map(([topic, stat]) => {
        const allRight = stat.correct === stat.total;
        return `<span class="topic-chip ${allRight ? 'good' : 'practice'}">${allRight ? '✓' : '↻'} ${escapeHtml(topic)} (${stat.correct}/${stat.total})</span>`;
      })
      .join('');
  }

  const retryBtn = $('#retryWrongButton');
  if (retryBtn) {
    if (missedQuestions.length > 0) {
      retryBtn.hidden = false;
      retryBtn.textContent = `🔄 ${missedQuestions.length} Fehler nochmal knacken`;
    } else {
      retryBtn.hidden = true;
    }
  }
}

function nextQuestion() {
  if (!answered) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion += 1;
    renderQuestion();
    return;
  }

  const progress = getProgress();
  const grade = progress.selectedGrade || 5;
  const subject = subjectCatalog[activeSubjectId] || subjectCatalog.fractions;

  $('#resultCorrect').textContent = `${correctCount}/${questions.length}`;
  $('#resultXp').textContent = score;
  $('#bestStreak').textContent = bestStreak;

  const perfectRound = correctCount === questions.length;
  if (isRetryRound) {
    $('#resultTitle').textContent = perfectRound ? 'Alle Fehler geknackt!' : 'Stark nachgearbeitet!';
    $('#resultMessage').textContent = perfectRound
      ? 'Du hast alle offenen Aufgaben in der zweiten Chance gelöst. Mega!'
      : 'Jede Wiederholung festigt dein Wissen im Langzeitgedächtnis.';
  } else if (isFocusRound) {
    $('#resultTitle').textContent = perfectRound ? 'Fokus-Thema gemeistert!' : 'Stark trainiert!';
    $('#resultMessage').textContent = `Gezieltes Training zu „${focusTopicName}“ abgeschlossen.`;
  } else {
    const heroTitles = {
      fractions: 'Du Bruch-Profi!',
      geometry: 'Formen-Ass!',
      words: 'Wort-Detektiv!',
      english: 'English Pro!',
      science: 'Energie-Experte!'
    };
    $('#resultTitle').textContent = perfectRound
      ? heroTitles[activeSubjectId] || 'Voll abgeräumt!'
      : correctCount >= Math.ceil(questions.length * 0.6)
        ? 'Richtig starke Runde!'
        : 'Mutig drangeblieben!';
    $('#resultMessage').textContent = perfectRound
      ? `Alles richtig in „${subject.title}“! Dein Wissen sitzt heute bombenfest.`
      : 'Jeder Versuch macht dich besser. Knack offene Aufgaben gleich in der Zweiten Chance!';
  }

  awardXp(score);
  if (!isRetryRound && !isFocusRound) {
    recordQuizCompletion(activeSubjectId, grade, correctCount, questions.length);
  }
  if (!isFocusRound) {
    unlockBadge(subject.badgeId);
  }
  renderQuestMap();
  renderResultSummary();
  createConfetti();
  showView('result');
  playChime([523.25, 659.25, 783.99], progress.soundOn);
}

export function startLesson({ subjectId = null, retryQuestions = null, updateHash = true } = {}) {
  const progress = getProgress();
  const grade = progress.selectedGrade || 5;

  if (subjectId && subjectCatalog[subjectId]) {
    activeSubjectId = subjectId;
    setLastSubject(subjectId);
  } else if (!subjectCatalog[activeSubjectId]) {
    activeSubjectId = progress.lastSubject || 'fractions';
  }

  isRetryRound = Array.isArray(retryQuestions) && retryQuestions.length > 0;
  isFocusRound = false;
  focusTopicName = '';
  questions = isRetryRound
    ? retryQuestions.map(q => prepareQuestionWithShuffledAnswers(q))
    : buildSubjectQuizSession(activeSubjectId, grade);

  if (activeSubjectId === 'fractions') {
    visitStation('quest');
  }

  currentQuestion = 0;
  score = 0;
  correctCount = 0;
  currentStreak = 0;
  bestStreak = 0;
  missedQuestions = [];
  roundTopicBreakdown = {};

  $('#scoreValue').textContent = '0';
  $('#lessonStreak').textContent = '0';
  if ($('#lessonStreakMobile')) $('#lessonStreakMobile').textContent = '0';
  showView('lesson', { updateHash });
  renderQuestion();
}

export function startFocusLesson(grade, topic, { updateHash = true } = {}) {
  const session = buildTopicFocusSession(grade, topic);
  activeSubjectId = session.subjectId;
  isRetryRound = false;
  isFocusRound = true;
  focusTopicName = topic;
  questions = session.questions;

  currentQuestion = 0;
  score = 0;
  correctCount = 0;
  currentStreak = 0;
  bestStreak = 0;
  missedQuestions = [];
  roundTopicBreakdown = {};

  $('#scoreValue').textContent = '0';
  $('#lessonStreak').textContent = '0';
  if ($('#lessonStreakMobile')) $('#lessonStreakMobile').textContent = '0';
  showView('lesson', { updateHash });
  renderQuestion();
}

function speakCurrentLesson(button) {
  const question = questions[currentQuestion];
  if (!question) return;
  const parts = [question.title];
  if (question.sentence) parts.push(question.sentence.replace(/[[\]]/g, ''));
  if (question.equation) parts.push(question.equation);
  if (question.from && question.to) parts.push(`${question.from} zu ${question.to}`);
  if (question.fraction) parts.push(question.fraction);
  if (question.fractions) parts.push(question.fractions.join(' oder '));
  parts.push(answered ? $('#feedbackText').textContent : question.hint);

  speakText(parts.join('. '), {
    soundOn: getProgress().soundOn,
    button,
    onSoundDisabled: showToast
  });
}

function handleQuizKeyboard(event) {
  const lessonView = $('#lessonView');
  if (!lessonView || !lessonView.classList.contains('active')) return;
  if (document.querySelector('dialog[open]')) return;
  const tag = event.target?.tagName;
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;

  if (!answered && ['1', '2', '3'].includes(event.key)) {
    event.preventDefault();
    checkAnswer(Number(event.key) - 1);
  } else if (answered && (event.key === 'ArrowRight' || (event.key === 'Enter' && tag !== 'BUTTON'))) {
    event.preventDefault();
    nextQuestion();
  }
}

export function initQuestStation() {
  $('#questStartButton')?.addEventListener('click', () => startLesson({ subjectId: 'fractions' }));
  $('#againButton')?.addEventListener('click', () => {
    if (isFocusRound && focusTopicName) {
      startFocusLesson(getProgress().selectedGrade || 5, focusTopicName);
    } else {
      startLesson({ subjectId: activeSubjectId });
    }
  });
  $('#retryWrongButton')?.addEventListener('click', () => {
    if (missedQuestions.length > 0) {
      startLesson({ subjectId: activeSubjectId, retryQuestions: missedQuestions });
    }
  });
  $('#profiModeToggle')?.addEventListener('click', () => {
    const next = setProfiMode(!getProgress().profiMode);
    syncProfiToggleUI();
    if (!answered && questions[currentQuestion]) {
      renderAnswerArea(questions[currentQuestion]);
    }
    showToast(
      next ? '🎯 Profi-Eingabe aktiv' : '📋 Auswahl-Modus aktiv',
      next ? 'Rechenaufgaben tippst du jetzt selbst ein (+30 XP)!' : 'Du wählst wieder aus 3 Antworten.'
    );
  });
  $('#nextButton')?.addEventListener('click', nextQuestion);
  $('#lessonMascot')?.addEventListener('click', () => reactWithFiete('lesson'));
  $('#lessonSpeakButton')?.addEventListener('click', event => speakCurrentLesson(event.currentTarget));
  document.addEventListener?.('keydown', handleQuizKeyboard);

  renderQuestMap();
  syncProfiToggleUI();
}
