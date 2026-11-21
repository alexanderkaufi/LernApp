/**
 * Station 3: Bruch-Duell with grade-specific fraction, negative, decimal,
 * and percentage comparisons plus a visual proof overlay after answering.
 */

import {
  compareFractions,
  formatDecimalDE,
  formatPercentDE,
  greatestCommonDivisor
} from '../core/math.js';
import { playTone } from '../core/audio.js';
import { getProgress, recordDuelOutcome } from '../core/store.js';
import { $, $$, setStationTutor } from '../core/ui.js';

let duelState = {
  left: { label: '2/3', num: 2, den: 3 },
  right: { label: '3/5', num: 3, den: 5 },
  result: 'left',
  explanation: '',
  answered: false
};

function lcm(a, b) {
  return Math.abs(a * b) / greatestCommonDivisor(a, b);
}

function buildDuelExplanation(left, right, result) {
  const relation = result === 'left' ? '>' : result === 'right' ? '<' : '=';
  const hasPercentOrDecimal =
    left.label.includes('%') ||
    left.label.includes(',') ||
    right.label.includes('%') ||
    right.label.includes(',');

  if (left.num < 0 || right.num < 0) {
    if (result === 'equal') {
      return `Beide Seiten haben exakt denselben Wert (${formatDecimalDE(left.num / left.den, 3)}).`;
    }
    const larger = result === 'left' ? left : right;
    const smaller = result === 'left' ? right : left;
    return `Zahlengerade: ${larger.label} (${formatDecimalDE(larger.num / larger.den, 3)}) liegt weiter rechts als ${smaller.label} (${formatDecimalDE(smaller.num / smaller.den, 3)}).`;
  }

  if (hasPercentOrDecimal) {
    return `Vergleich: ${left.label} (${formatPercentDE(left.num / left.den, 1)}) ${relation} ${right.label} (${formatPercentDE(right.num / right.den, 1)}).`;
  }

  const common = lcm(left.den, right.den);
  const leftExpanded = (left.num * common) / left.den;
  const rightExpanded = (right.num * common) / right.den;
  return `Hauptnenner ${common}: ${left.label} = ${leftExpanded}/${common} ${relation} ${right.label} = ${rightExpanded}/${common}`;
}

function randomPick(items, rng) {
  return items[Math.floor(rng() * items.length)];
}

/**
 * Generates a grade-appropriate comparison pair.
 */
export function createDuelRound(grade, rng = Math.random) {
  const g = Number(grade) || 5;
  let left;
  let right;

  if (g === 5) {
    if (rng() < 0.25) {
      const pair = randomPick(
        [
          [
            { label: '1/2', num: 1, den: 2 },
            { label: '2/4', num: 2, den: 4 }
          ],
          [
            { label: '1/2', num: 1, den: 2 },
            { label: '3/6', num: 3, den: 6 }
          ],
          [
            { label: '2/3', num: 2, den: 3 },
            { label: '4/6', num: 4, den: 6 }
          ],
          [
            { label: '3/4', num: 3, den: 4 },
            { label: '6/8', num: 6, den: 8 }
          ],
          [
            { label: '1/3', num: 1, den: 3 },
            { label: '2/6', num: 2, den: 6 }
          ]
        ],
        rng
      );
      [left, right] = rng() < 0.5 ? pair : [pair[1], pair[0]];
    } else {
      const denA = 2 + Math.floor(rng() * 7);
      const denB = 2 + Math.floor(rng() * 7);
      const numA = 1 + Math.floor(rng() * (denA - 1));
      const numB = 1 + Math.floor(rng() * (denB - 1));
      left = { label: `${numA}/${denA}`, num: numA, den: denA };
      right = { label: `${numB}/${denB}`, num: numB, den: denB };
    }
  } else if (g === 6) {
    if (rng() < 0.25) {
      const pair = randomPick(
        [
          [
            { label: '3/4', num: 3, den: 4 },
            { label: '9/12', num: 9, den: 12 }
          ],
          [
            { label: '2/5', num: 2, den: 5 },
            { label: '4/10', num: 4, den: 10 }
          ],
          [
            { label: '5/6', num: 5, den: 6 },
            { label: '10/12', num: 10, den: 12 }
          ],
          [
            { label: '2/3', num: 2, den: 3 },
            { label: '8/12', num: 8, den: 12 }
          ],
          [
            { label: '4/6', num: 4, den: 6 },
            { label: '6/9', num: 6, den: 9 }
          ]
        ],
        rng
      );
      [left, right] = rng() < 0.5 ? pair : [pair[1], pair[0]];
    } else {
      const denA = 3 + Math.floor(rng() * 10);
      let denB = 3 + Math.floor(rng() * 10);
      if (denB === denA) denB = denA < 12 ? denA + 1 : denA - 1;
      const numA = 1 + Math.floor(rng() * (denA - 1));
      const numB = 1 + Math.floor(rng() * (denB - 1));
      left = { label: `${numA}/${denA}`, num: numA, den: denA };
      right = { label: `${numB}/${denB}`, num: numB, den: denB };
    }
  } else if (g === 7) {
    const mode = rng();
    if (mode < 0.45) {
      const pair = randomPick(
        [
          [
            { label: '−2/3', num: -2, den: 3 },
            { label: '−3/4', num: -3, den: 4 }
          ],
          [
            { label: '−1/2', num: -1, den: 2 },
            { label: '−2/5', num: -2, den: 5 }
          ],
          [
            { label: '−3/8', num: -3, den: 8 },
            { label: '−1/2', num: -1, den: 2 }
          ],
          [
            { label: '−1/2', num: -1, den: 2 },
            { label: '−3/6', num: -3, den: 6 }
          ],
          [
            { label: '−5/6', num: -5, den: 6 },
            { label: '−4/5', num: -4, den: 5 }
          ]
        ],
        rng
      );
      [left, right] = rng() < 0.5 ? pair : [pair[1], pair[0]];
    } else if (mode < 0.75) {
      const pair = randomPick(
        [
          [
            { label: '5/4', num: 5, den: 4 },
            { label: '7/6', num: 7, den: 6 }
          ],
          [
            { label: '4/3', num: 4, den: 3 },
            { label: '6/5', num: 6, den: 5 }
          ],
          [
            { label: '3/2', num: 3, den: 2 },
            { label: '6/4', num: 6, den: 4 }
          ],
          [
            { label: '7/4', num: 7, den: 4 },
            { label: '5/3', num: 5, den: 3 }
          ]
        ],
        rng
      );
      [left, right] = rng() < 0.5 ? pair : [pair[1], pair[0]];
    } else {
      const denA = 3 + Math.floor(rng() * 9);
      const denB = 3 + Math.floor(rng() * 9);
      const numA = 1 + Math.floor(rng() * (denA - 1));
      const numB = 1 + Math.floor(rng() * (denB - 1));
      left = { label: `${numA}/${denA}`, num: numA, den: denA };
      right = { label: `${numB}/${denB}`, num: numB, den: denB };
    }
  } else {
    // Grade 8: percentages, decimals, and negative/tricky comparisons
    const pair = randomPick(
      [
        [
          { label: '3/8', num: 3, den: 8 },
          { label: '40 %', num: 40, den: 100 }
        ],
        [
          { label: '3/4', num: 3, den: 4 },
          { label: '75 %', num: 75, den: 100 }
        ],
        [
          { label: '5/8', num: 5, den: 8 },
          { label: '60 %', num: 60, den: 100 }
        ],
        [
          { label: '7/8', num: 7, den: 8 },
          { label: '85 %', num: 85, den: 100 }
        ],
        [
          { label: '2/5', num: 2, den: 5 },
          { label: '40 %', num: 40, den: 100 }
        ],
        [
          { label: '0,75', num: 75, den: 100 },
          { label: '4/5', num: 4, den: 5 }
        ],
        [
          { label: '0,625', num: 625, den: 1000 },
          { label: '5/8', num: 5, den: 8 }
        ],
        [
          { label: '1/3', num: 1, den: 3 },
          { label: '0,3', num: 3, den: 10 }
        ],
        [
          { label: '−5/6', num: -5, den: 6 },
          { label: '−7/8', num: -7, den: 8 }
        ]
      ],
      rng
    );
    [left, right] = rng() < 0.5 ? pair : [pair[1], pair[0]];
  }

  const cmp = compareFractions(left.num, left.den, right.num, right.den);
  const result = cmp === 0 ? 'equal' : cmp > 0 ? 'left' : 'right';

  return {
    left,
    right,
    result,
    explanation: buildDuelExplanation(left, right, result)
  };
}

function renderDuelProof(round) {
  const proofEl = $('#duelProof');
  if (!proofEl) return;

  const leftVal = round.left.num / round.left.den;
  const rightVal = round.right.num / round.right.den;
  const isNegative = leftVal < 0 || rightVal < 0;
  const maxVal = Math.max(1, Math.abs(leftVal), Math.abs(rightVal));

  const barWidth = value => Math.min(100, Math.round((Math.abs(value) / maxVal) * 100));

  proofEl.innerHTML = `
    <p class="duel-proof-title">${round.explanation}</p>
    <div class="duel-bars ${isNegative ? 'negative' : ''}">
      <div class="duel-bar-row">
        <span>${round.left.label}</span>
        <div class="duel-bar-track"><i style="width:${barWidth(leftVal)}%"></i></div>
        <b>${formatDecimalDE(leftVal, 3)}</b>
      </div>
      <div class="duel-bar-row right">
        <span>${round.right.label}</span>
        <div class="duel-bar-track"><i style="width:${barWidth(rightVal)}%"></i></div>
        <b>${formatDecimalDE(rightVal, 3)}</b>
      </div>
    </div>
  `;
  proofEl.classList.add('show');
}

function updateDuelStreakUI() {
  const el = $('#duelStreakValue');
  if (el) {
    el.textContent = getProgress().stationStats?.duelStreak || 0;
  }
}

export function newDuel() {
  const grade = getProgress().selectedGrade || 5;
  const round = createDuelRound(grade);
  duelState = { ...round, answered: false };

  const leftEl = $('#leftFraction');
  const rightEl = $('#rightFraction');
  if (leftEl) leftEl.textContent = duelState.left.label;
  if (rightEl) rightEl.textContent = duelState.right.label;

  const arm = $('#balanceArm');
  if (arm) arm.style.transform = 'rotate(0deg)';
  const feedback = $('#duelFeedback');
  if (feedback) feedback.className = 'station-feedback';
  const proof = $('#duelProof');
  if (proof) {
    proof.className = 'duel-proof';
    proof.innerHTML = '';
  }

  $$('.duel-answers button').forEach(button => {
    button.disabled = false;
  });
  updateDuelStreakUI();

  const tutorHint =
    grade >= 7
      ? 'Tipp: Wandle gedanklich in Dezimalzahlen um oder achte genau auf Vorzeichen.'
      : 'Tipp: Du kannst beide Brüche als Teil eines gleich großen Ganzen denken.';
  setStationTutor(tutorHint, 'thinking');
}

function answerDuel(answer) {
  if (duelState.answered) return;
  duelState.answered = true;

  const result = duelState.result;
  const correct = result === answer;
  const arm = $('#balanceArm');
  if (arm) {
    arm.style.transform =
      result === 'left' ? 'rotate(-8deg)' : result === 'right' ? 'rotate(8deg)' : 'rotate(0deg)';
  }
  $$('.duel-answers button').forEach(button => {
    button.disabled = true;
  });

  const feedback = $('#duelFeedback');
  feedback.className = `station-feedback show ${correct ? 'success' : 'try-again'}`;
  recordDuelOutcome(correct);
  updateDuelStreakUI();
  renderDuelProof(duelState);

  if (correct) {
    feedback.textContent = 'Richtig verglichen! Die Waage und die Streifen bestätigen deine Entscheidung. +15 XP';
    setStationTutor('Du hast echte Größenanteile verglichen, nicht nur Ziffern geraten. Stark!', 'celebrating');
    playTone(700, 0.18, getProgress().soundOn);
  } else {
    const labels = { left: 'links', right: 'rechts', equal: 'auf beiden Seiten gleich' };
    feedback.textContent = `Guter Versuch! Tatsächlich ist es ${labels[result]}. Schau dir den Beweis direkt unter der Waage an.`;
    setStationTutor('Kein Problem: Schau auf die beiden Balken unten – da sieht man den Größenunterschied sofort.', 'thinking');
    playTone(260, 0.18, getProgress().soundOn);
  }
}

export function initDuelStation() {
  $$('[data-duel]').forEach(button => {
    button.addEventListener('click', () => answerDuel(button.dataset.duel));
  });
  $('#newDuelButton')?.addEventListener('click', newDuel);
  newDuel();
}
