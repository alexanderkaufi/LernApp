/**
 * 60-Second Blitz-Sprint: endless grade-specific rapid-fire mental trainer
 * with optional calm mode (no timer) and personal high scores per grade.
 */

import { escapeHtml, expressionHTML, formatSentenceMarkup, shuffleArray } from '../core/math.js';
import { playChime, playTone } from '../core/audio.js';
import { getProgress, recordSprintResult } from '../core/store.js';
import { $, $$, setStationTutor } from '../core/ui.js';

let sprintTimerId = null;
let sprintRunning = false;
let secondsLeft = 60;
let hits = 0;
let combo = 0;
let currentSprintQ = null;
let calmMode = false;

/**
 * Generates an endless grade-appropriate rapid question with 3 distinct options.
 */
export function createSprintQuestion(grade, rng = Math.random) {
  const g = Number(grade) || 5;
  const pick = arr => arr[Math.floor(rng() * arr.length)];

  const pools = {
    5: [
      () => {
        const [den, mult] = pick([
          [2, 7],
          [2, 9],
          [4, 4],
          [4, 5],
          [3, 6],
          [5, 4]
        ]);
        const total = den * mult;
        const ans = String(mult);
        const d1 = String(mult + 2);
        const d2 = String(Math.max(1, mult - 1));
        return {
          tag: 'BRUCH-ANTEIL',
          prompt: `1/${den} von ${total}`,
          answers: [ans, d1, d2],
          correctText: ans
        };
      },
      () => {
        const [raw, simp, w1, w2] = pick([
          ['2/4', '1/2', '1/4', '2/2'],
          ['4/8', '1/2', '1/4', '2/3'],
          ['6/8', '3/4', '2/3', '3/8'],
          ['3/6', '1/2', '1/3', '2/6'],
          ['4/6', '2/3', '1/3', '3/4']
        ]);
        return {
          tag: 'KÜRZEN',
          prompt: `${raw} gekürzt = ?`,
          answers: [simp, w1, w2],
          correctText: simp
        };
      },
      () => {
        const [deg, kind] = pick([
          [40, 'Spitzer Winkel'],
          [90, 'Rechter Winkel'],
          [125, 'Stumpfer Winkel'],
          [180, 'Gestreckter Winkel']
        ]);
        const others = ['Spitzer Winkel', 'Rechter Winkel', 'Stumpfer Winkel', 'Gestreckter Winkel'].filter(
          k => k !== kind
        );
        return {
          tag: 'GEOMETRIE',
          prompt: `Winkel mit ${deg}°`,
          answers: [kind, others[0], others[1]],
          correctText: kind
        };
      },
      () => {
        const a = 3 + Math.floor(rng() * 6);
        const b = 2 + Math.floor(rng() * 5);
        const val = a * b;
        const area = `${val} cm²`;
        const candidates = [
          ...new Set([`${2 * (a + b)} cm²`, `${val + 2} cm²`, `${val + 4} cm²`, `${val + 6} cm²`])
        ].filter(x => x !== area);
        return {
          tag: 'FLÄCHE',
          prompt: `Rechteck ${a} cm · ${b} cm`,
          answers: [area, candidates[0], candidates[1]],
          correctText: area
        };
      },
      () => {
        const [q, ans, w1, w2] = pick([
          ['I ___ twelve years old.', 'am', 'is', 'are'],
          ['Plural von »child«', 'children', 'childs', 'childrens'],
          ['»always« auf Deutsch', 'immer', 'oft', 'selten']
        ]);
        return { tag: 'ENGLISCH', prompt: q, answers: [ans, w1, w2], correctText: ans };
      }
    ],
    6: [
      () => {
        const [expr, ans, w1, w2] = pick([
          ['2/5 + 1/5', '3/5', '3/10', '1/5'],
          ['3/7 + 2/7', '5/7', '5/14', '6/7'],
          ['5/8 − 2/8', '3/8', '3/16', '7/8'],
          ['1/3 + 1/6', '1/2', '2/9', '1/3']
        ]);
        return { tag: 'RECHNEN', prompt: expr, answers: [ans, w1, w2], correctText: ans };
      },
      () => {
        const [dec, frac, w1, w2] = pick([
          ['0,5', '1/2', '1/5', '2/5'],
          ['0,25', '1/4', '2/5', '1/2'],
          ['0,75', '3/4', '7/5', '2/3'],
          ['0,2', '1/5', '1/2', '2/5']
        ]);
        return { tag: 'DEZIMALZAHL', prompt: `${dec} als Bruch`, answers: [frac, w1, w2], correctText: frac };
      },
      () => {
        const [expr, ans, w1, w2] = pick([
          ['Ich helfe [dem Kind]', 'Dativ', 'Genitiv', 'Akkusativ'],
          ['Das Fell [des Wolfes]', 'Genitiv', 'Dativ', 'Nominativ'],
          ['Sie sieht [einen Film]', 'Akkusativ', 'Dativ', 'Genitiv']
        ]);
        return { tag: 'DEUTSCH · KASUS', prompt: expr, answers: [ans, w1, w2], correctText: ans };
      },
      () => {
        const [q, ans, w1, w2] = pick([
          ['Eis schmilzt bei …', '0 °C', '10 °C', '100 °C'],
          ['Wasser siedet bei …', '100 °C', '80 °C', '50 °C'],
          ['Flüssig → Gasförmig', 'Verdampfen', 'Kondensieren', 'Schmelzen']
        ]);
        return { tag: 'NATUR & TECHNIK', prompt: q, answers: [ans, w1, w2], correctText: ans };
      },
      () => {
        const [q, ans, w1, w2] = pick([
          ['Simple Past von »go«', 'went', 'goed', 'gone'],
          ['Simple Past von »see«', 'saw', 'seed', 'seen'],
          ['Superlativ von »good«', 'best', 'goodest', 'better']
        ]);
        return { tag: 'ENGLISCH', prompt: q, answers: [ans, w1, w2], correctText: ans };
      }
    ],
    7: [
      () => {
        const [expr, ans, w1, w2] = pick([
          ['2/3 · 3/4', '1/2', '6/7', '2/4'],
          ['3/5 · 5/6', '1/2', '8/11', '3/6'],
          ['1/2 : 1/4', '2', '1/8', '1/2'],
          ['−2/5 + 3/5', '1/5', '−1/5', '5/5']
        ]);
        return { tag: 'BRÜCHE', prompt: expr, answers: [ans, w1, w2], correctText: ans };
      },
      () => {
        const a = 40 + Math.floor(rng() * 5) * 10;
        const b = 30 + Math.floor(rng() * 4) * 10;
        const c = 180 - a - b;
        return {
          tag: 'DREIECK',
          prompt: `Winkel: ${a}° und ${b}° → 3. Winkel?`,
          answers: [`${c}°`, `${c + 10}°`, `${Math.max(10, c - 10)}°`],
          correctText: `${c}°`
        };
      },
      () => {
        const [q, ans, w1, w2] = pick([
          ['Einheit für Spannung U', 'Volt (V)', 'Ampere (A)', 'Watt (W)'],
          ['Einheit für Stromstärke I', 'Ampere (A)', 'Volt (V)', 'Ohm (Ω)'],
          ['v = 40 km : 2 h', '20 km/h', '80 km/h', '38 km/h']
        ]);
        return { tag: 'PHYSIK', prompt: q, answers: [ans, w1, w2], correctText: ans };
      },
      () => {
        const [q, ans, w1, w2] = pick([
          ['»weil« leitet ein …', 'Nebensatz', 'Hauptsatz', 'Adjektiv'],
          ['»Das Bild wird gemalt«', 'Vorgangspassiv', 'Plusquamperfekt', 'Imperativ'],
          ['»hatte gesehen«', 'Plusquamperfekt', 'Perfekt', 'Präteritum']
        ]);
        return { tag: 'DEUTSCH', prompt: q, answers: [ans, w1, w2], correctText: ans };
      },
      () => {
        const [q, ans, w1, w2] = pick([
          ['We lived here ___ 2021.', 'since', 'for', 'ago'],
          ['They trained ___ 3 hours.', 'for', 'since', 'from'],
          ['3. Form von »write«', 'written', 'wrote', 'writed']
        ]);
        return { tag: 'ENGLISCH', prompt: q, answers: [ans, w1, w2], correctText: ans };
      }
    ],
    8: [
      () => {
        const [q, ans, w1, w2] = pick([
          ['3/4 in Prozent', '75 %', '34 %', '60 %'],
          ['3/8 in Prozent', '37,5 %', '38 %', '62,5 %'],
          ['1/5 in Prozent', '20 %', '15 %', '25 %'],
          ['7/8 in Prozent', '87,5 %', '78 %', '80 %']
        ]);
        return { tag: 'PROZENTE', prompt: q, answers: [ans, w1, w2], correctText: ans };
      },
      () => {
        const [expr, ans, w1, w2] = pick([
          ['x/3 = 4 → x = ?', '12', '7', '4/3'],
          ['2/x = 1/5 → x = ?', '10', '7', '2,5'],
          ['6x/9 gekürzt', '2x/3', '3x/2', '2x/9'],
          ['3/4 · x = 24 → x = ?', '32', '18', '28']
        ]);
        return { tag: 'GLEICHUNG', prompt: expr, answers: [ans, w1, w2], correctText: ans };
      },
      () => {
        const r = 3 + Math.floor(rng() * 7);
        return {
          tag: 'KREIS',
          prompt: `Kreis r = ${r} cm → d = ?`,
          answers: [`${2 * r} cm`, `${r * r} cm`, `${r + 2} cm`],
          correctText: `${2 * r} cm`
        };
      },
      () => {
        const [expr, ans, w1, w2] = pick([
          ['R = 12 V : 4 A', '3 Ω', '48 Ω', '8 Ω'],
          ['E = 0,5 kW · 4 h', '2 kWh', '4,5 kWh', '0,125 kWh'],
          ['η = 40 J : 100 J', '40 %', '60 %', '2,5 %']
        ]);
        return { tag: 'ENERGIE', prompt: expr, answers: [ans, w1, w2], correctText: ans };
      },
      () => {
        const [q, ans, w1, w2] = pick([
          ['False Friend: »become«', 'werden', 'bekommen', 'bleiben'],
          ['If I ___ you, I would go.', 'were', 'am', 'would'],
          ['The bridge ___ built in 1995.', 'was', 'is', 'has']
        ]);
        return { tag: 'ENGLISCH', prompt: q, answers: [ans, w1, w2], correctText: ans };
      }
    ]
  };

  const generator = pick(pools[g] || pools[5]);
  const raw = generator();
  const shuffled = shuffleArray(raw.answers, rng);
  return {
    tag: raw.tag,
    prompt: raw.prompt,
    answers: shuffled,
    correct: shuffled.indexOf(raw.correctText)
  };
}

export function stopSprintTimer() {
  if (sprintTimerId) {
    clearInterval(sprintTimerId);
    sprintTimerId = null;
  }
  sprintRunning = false;
}

function updateSprintHeaderUI() {
  const grade = getProgress().selectedGrade || 5;
  const best = getProgress().sprintBestByGrade?.[grade] || 0;
  if ($('#sprintBestValue')) $('#sprintBestValue').textContent = String(best);
  if ($('#sprintHitsValue')) $('#sprintHitsValue').textContent = String(hits);
  if ($('#sprintComboValue')) $('#sprintComboValue').textContent = `${combo}x`;
  if ($('#sprintTimerValue')) {
    $('#sprintTimerValue').textContent = calmMode ? '∞' : `${secondsLeft}s`;
  }
}

function renderNextSprintQuestion() {
  const grade = getProgress().selectedGrade || 5;
  currentSprintQ = createSprintQuestion(grade);

  if ($('#sprintTag')) $('#sprintTag').textContent = currentSprintQ.tag;
  if ($('#sprintQuestionPrompt')) {
    $('#sprintQuestionPrompt').innerHTML = currentSprintQ.prompt.includes('[')
      ? formatSentenceMarkup(currentSprintQ.prompt)
      : expressionHTML(currentSprintQ.prompt);
  }
  const answersEl = $('#sprintAnswers');
  if (answersEl) {
    answersEl.innerHTML = currentSprintQ.answers
      .map(
        (ans, idx) =>
          `<button type="button" class="answer-button" data-sprint-answer="${idx}">${escapeHtml(ans)}</button>`
      )
      .join('');
    $$('[data-sprint-answer]', answersEl).forEach(btn => {
      btn.addEventListener('click', () => handleSprintAnswer(Number(btn.dataset.sprintAnswer)));
    });
  }
}

function finishSprint() {
  stopSprintTimer();
  const grade = getProgress().selectedGrade || 5;
  const xpGain = hits * 5;
  const isRecord = hits > 0 ? recordSprintResult(grade, hits, xpGain) : false;

  if ($('#sprintActiveBox')) $('#sprintActiveBox').classList.add('hidden');
  if ($('#sprintIntroBox')) $('#sprintIntroBox').classList.remove('hidden');

  const fb = $('#sprintResultFeedback');
  if (fb) {
    fb.className = 'station-feedback show success';
    fb.textContent =
      hits === 0
        ? 'Runde beendet – starte gleich noch einmal!'
        : `Stark gesprintet! ${hits} Treffer = +${xpGain} XP.${isRecord ? ' 🏆 Neuer Klassenrekord!' : ''}`;
  }
  setStationTutor(
    hits >= 5
      ? `Wow, ${hits} Treffer! Dein Kopf schaltet blitzschnell.`
      : 'Ruhig weitertrainieren – jeder Sprint macht dich noch sicherer!',
    hits >= 5 ? 'celebrating' : 'happy'
  );
  updateSprintHeaderUI();
  playChime([523.25, 659.25, 783.99], getProgress().soundOn);
}

function handleSprintAnswer(index) {
  if (!sprintRunning || !currentSprintQ) return;
  const correct = index === currentSprintQ.correct;
  const soundOn = getProgress().soundOn;
  const statusEl = $('#sprintLiveFeedback');

  if (correct) {
    hits += 1;
    combo += 1;
    if (statusEl) {
      statusEl.textContent = combo >= 3 ? `✓ Stark! ${combo}er Combo! 🔥` : '✓ Treffer!';
      statusEl.className = 'sprint-live-feedback good';
    }
    playTone(580 + Math.min(combo, 6) * 25, 0.1, soundOn);
  } else {
    combo = 0;
    const rightAns = currentSprintQ.answers[currentSprintQ.correct];
    if (statusEl) {
      statusEl.textContent = `Richtig wäre: ${rightAns}`;
      statusEl.className = 'sprint-live-feedback info';
    }
    playTone(270, 0.12, soundOn);
  }

  updateSprintHeaderUI();
  renderNextSprintQuestion();
}

function startSprint() {
  stopSprintTimer();
  calmMode = Boolean($('#sprintCalmToggle')?.checked);
  sprintRunning = true;
  secondsLeft = 60;
  hits = 0;
  combo = 0;

  if ($('#sprintResultFeedback')) $('#sprintResultFeedback').className = 'station-feedback';
  if ($('#sprintLiveFeedback')) {
    $('#sprintLiveFeedback').textContent = 'Los geht’s – tippe oder drücke 1, 2, 3!';
    $('#sprintLiveFeedback').className = 'sprint-live-feedback';
  }
  if ($('#sprintIntroBox')) $('#sprintIntroBox').classList.add('hidden');
  if ($('#sprintActiveBox')) $('#sprintActiveBox').classList.remove('hidden');

  updateSprintHeaderUI();
  renderNextSprintQuestion();
  setStationTutor('Tempo ohne Stress: Bei einem Fehler verlierst du keine Punkte!', 'happy');

  if (!calmMode) {
    sprintTimerId = setInterval(() => {
      if (!$('#sprintPanel')?.classList.contains('active') || !$('#stationView')?.classList.contains('active')) {
        stopSprintTimer();
        return;
      }
      secondsLeft -= 1;
      updateSprintHeaderUI();
      if (secondsLeft <= 0) {
        finishSprint();
      }
    }, 1000);
  }
}

export function resetSprintForGrade() {
  stopSprintTimer();
  hits = 0;
  combo = 0;
  secondsLeft = 60;
  if ($('#sprintActiveBox')) $('#sprintActiveBox').classList.add('hidden');
  if ($('#sprintIntroBox')) $('#sprintIntroBox').classList.remove('hidden');
  if ($('#sprintResultFeedback')) $('#sprintResultFeedback').className = 'station-feedback';
  updateSprintHeaderUI();
}

export function initSprintStation() {
  $('#sprintStartButton')?.addEventListener('click', startSprint);
  $('#sprintStopButton')?.addEventListener('click', finishSprint);
  document.addEventListener?.('keydown', event => {
    if (!sprintRunning) return;
    if (!$('#sprintPanel')?.classList.contains('active')) return;
    if (!$('#stationView')?.classList.contains('active')) return;
    if (['1', '2', '3'].includes(event.key)) {
      event.preventDefault();
      handleSprintAnswer(Number(event.key) - 1);
    }
  });
  resetSprintForGrade();
}
