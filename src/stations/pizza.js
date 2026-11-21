/**
 * Station 1: Pizza-Bäckerei with focus-preserving SVG interaction and grade-specific orders.
 */

import { formatPercentDE } from '../core/math.js';
import { playTone } from '../core/audio.js';
import { getProgress, recordActivity, recordPizzaSolved } from '../core/store.js';
import { $, $$, setStationTutor } from '../core/ui.js';

const pizzaCustomers = ['Mia', 'Bruno', 'Lina', 'Sam', 'Noah'];

const pizzaState = {
  denominator: 4,
  renderedDenominator: null,
  targetCount: 3,
  orderLabel: '3/4',
  successDetail: 'Perfekt belegt: 3/4!',
  selected: new Set(),
  rewarded: false
};

function polarPoint(cx, cy, radius, angle) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians)
  };
}

function pizzaSlicePath(index, total) {
  const start = polarPoint(120, 120, 102, (index * 360) / total);
  const end = polarPoint(120, 120, 102, ((index + 1) * 360) / total);
  const largeArc = 360 / total > 180 ? 1 : 0;
  return `M 120 120 L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A 102 102 0 ${largeArc} 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
}

/**
 * Generates a grade-appropriate pizza order for the given denominator.
 */
export function createPizzaOrder(grade, denominator, rng = Math.random, previousLabel = null) {
  const customer = pizzaCustomers[Math.floor(rng() * pizzaCustomers.length)];
  const g = Number(grade) || 5;

  if (g === 6) {
    const pools = {
      2: [
        { label: '1/2', target: 1 },
        { label: '2/4', target: 1 },
        { label: '3/6', target: 1 },
        { label: '4/4', target: 2 }
      ],
      4: [
        { label: '1/2', target: 2 },
        { label: '4/8', target: 2 },
        { label: '6/8', target: 3 },
        { label: '2/8', target: 1 }
      ],
      6: [
        { label: '1/2', target: 3 },
        { label: '1/3', target: 2 },
        { label: '2/3', target: 4 },
        { label: '4/12', target: 2 }
      ],
      8: [
        { label: '1/2', target: 4 },
        { label: '1/4', target: 2 },
        { label: '3/4', target: 6 }
      ]
    };
    const choices = (pools[denominator] || pools[4]).filter(c => c.label !== previousLabel);
    const pick = choices[Math.floor(rng() * choices.length)] || pools[denominator][0];
    return {
      targetCount: pick.target,
      orderLabel: pick.label,
      prompt: `${customer} bestellt ${pick.label} der Pizza. Wie viele der ${denominator} Stücke musst du belegen?`,
      successDetail: `Perfekt erweitert/gekürzt: ${pick.target}/${denominator} ist gleichwertig zu ${pick.label}!`,
      hintMessage: `Rechne ${pick.label} auf den Nenner ${denominator} um.`
    };
  }

  if (g === 7) {
    const pools = {
      2: [
        { label: '1/4 + 1/4', target: 1 },
        { label: '1 − 1/2', target: 1 },
        { label: '1/2 + 1/2', target: 2 }
      ],
      4: [
        { label: '1/4 + 2/4', target: 3 },
        { label: '1/2 + 1/4', target: 3 },
        { label: '7/8 − 3/8', target: 2 },
        { label: '1 − 3/4', target: 1 }
      ],
      6: [
        { label: '1/3 + 1/6', target: 3 },
        { label: '1/2 + 1/3', target: 5 },
        { label: '5/6 − 1/3', target: 3 },
        { label: '1 − 2/3', target: 2 }
      ],
      8: [
        { label: '1/4 + 3/8', target: 5 },
        { label: '1/2 + 1/4', target: 6 },
        { label: '5/8 − 3/8', target: 2 },
        { label: '1 − 1/8', target: 7 },
        { label: '1/2 − 1/8', target: 3 }
      ]
    };
    const choices = (pools[denominator] || pools[4]).filter(c => c.label !== previousLabel);
    const pick = choices[Math.floor(rng() * choices.length)] || pools[denominator][0];
    return {
      targetCount: pick.target,
      orderLabel: pick.label,
      prompt: `${customer} bestellt ${pick.label} deiner ${denominator}-teiligen Pizza.`,
      successDetail: `Stark gerechnet: ${pick.label} = ${pick.target}/${denominator}!`,
      hintMessage: `Mache beide Brüche auf ${denominator}tel gleichnamig und zähle dann die Stücke.`
    };
  }

  if (g === 8) {
    const pools = {
      2: [
        { label: '50 %', target: 1 },
        { label: '100 %', target: 2 }
      ],
      4: [
        { label: '25 %', target: 1 },
        { label: '50 %', target: 2 },
        { label: '75 %', target: 3 },
        { label: '100 %', target: 4 }
      ],
      6: [
        { label: '50 %', target: 3 },
        { label: '100 %', target: 6 }
      ],
      8: [
        { label: '12,5 %', target: 1 },
        { label: '25 %', target: 2 },
        { label: '37,5 %', target: 3 },
        { label: '50 %', target: 4 },
        { label: '62,5 %', target: 5 },
        { label: '75 %', target: 6 },
        { label: '87,5 %', target: 7 }
      ]
    };
    const choices = (pools[denominator] || pools[4]).filter(c => c.label !== previousLabel);
    const pick = choices[Math.floor(rng() * choices.length)] || pools[denominator][0];
    return {
      targetCount: pick.target,
      orderLabel: pick.label,
      prompt: `${customer} bestellt genau ${pick.label} deiner ${denominator}-teiligen Pizza.`,
      successDetail: `Volltreffer: ${pick.label} entsprechen ${pick.target}/${denominator}!`,
      hintMessage: `Überlege, welcher Anteil von ${denominator} Stücken ${pick.label} entspricht.`
    };
  }

  // Grade 5 (default): direct piece counts, including occasional whole pizza (denominator/denominator)
  const allTargets = Array.from({ length: denominator }, (_, i) => i + 1);
  const candidates = allTargets.filter(n => `${n}/${denominator}` !== previousLabel);
  const target = candidates[Math.floor(rng() * candidates.length)] || 1;
  const label = `${target}/${denominator}`;
  return {
    targetCount: target,
    orderLabel: label,
    prompt:
      target === denominator
        ? `${customer} hat Riesenhunger und möchte die ganze Pizza (${target} von ${denominator} Stücken)!`
        : `${customer} möchte ${target} von ${denominator} Stücken mit Käse.`,
    successDetail: `Perfekt belegt: ${target}/${denominator} (${formatPercentDE(target / denominator, 0)})!`,
    hintMessage: `Zähle die belegten Stücke noch einmal. Du brauchst genau ${target}.`
  };
}

function updateSliceElement(slice, index, isSelected) {
  slice.classList.toggle('selected', isSelected);
  slice.setAttribute('aria-pressed', String(isSelected));
  slice.setAttribute(
    'aria-label',
    `Pizzastück ${index + 1} von ${pizzaState.denominator} ${isSelected ? 'abwählen' : 'belegen'}`
  );
}

function syncPizzaSelectionUI() {
  const svg = $('#pizzaSvg');
  if (svg) {
    $$('[data-slice]', svg).forEach(slice => {
      const index = Number(slice.dataset.slice);
      updateSliceElement(slice, index, pizzaState.selected.has(index));
    });
  }
  const readout = $('#pizzaFraction');
  if (readout) {
    readout.textContent = `${pizzaState.selected.size}/${pizzaState.denominator}`;
  }
}

function toggleSlice(index) {
  if (pizzaState.selected.has(index)) {
    pizzaState.selected.delete(index);
  } else {
    pizzaState.selected.add(index);
  }
  const slice = $(`[data-slice="${index}"]`, $('#pizzaSvg'));
  if (slice) {
    updateSliceElement(slice, index, pizzaState.selected.has(index));
  }
  const readout = $('#pizzaFraction');
  if (readout) {
    readout.textContent = `${pizzaState.selected.size}/${pizzaState.denominator}`;
  }
  playTone(420 + index * 25, 0.1, getProgress().soundOn);
}

function renderPizzaSvgIfNeeded() {
  const svg = $('#pizzaSvg');
  if (!svg) return;

  if (pizzaState.renderedDenominator !== pizzaState.denominator) {
    pizzaState.renderedDenominator = pizzaState.denominator;
    const slicesMarkup = Array.from({ length: pizzaState.denominator }, (_, index) => {
      return `<path class="pizza-slice" data-slice="${index}" d="${pizzaSlicePath(index, pizzaState.denominator)}" role="button" tabindex="0" aria-pressed="false" />`;
    }).join('');
    svg.innerHTML = `<circle cx="120" cy="120" r="111" class="pizza-crust"/>${slicesMarkup}<circle cx="120" cy="120" r="102" class="pizza-outline"/>`;

    $$('[data-slice]', svg).forEach(slice => {
      const index = Number(slice.dataset.slice);
      slice.addEventListener('click', () => toggleSlice(index));
      slice.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleSlice(index);
        }
      });
    });
  }

  syncPizzaSelectionUI();
}

export function updatePizzaOrder(randomize = true) {
  const progress = getProgress();
  pizzaState.selected.clear();
  pizzaState.rewarded = false;

  const order = randomize
    ? createPizzaOrder(progress.selectedGrade, pizzaState.denominator, Math.random, pizzaState.orderLabel)
    : createPizzaOrder(progress.selectedGrade, pizzaState.denominator);

  pizzaState.targetCount = order.targetCount;
  pizzaState.orderLabel = order.orderLabel;
  pizzaState.successDetail = order.successDetail;
  pizzaState.hintMessage = order.hintMessage;

  const orderText = $('#pizzaOrderText');
  if (orderText) orderText.textContent = order.prompt;
  const feedback = $('#pizzaFeedback');
  if (feedback) feedback.className = 'station-feedback';

  renderPizzaSvgIfNeeded();
}

function checkPizza() {
  const progress = getProgress();
  const correct = pizzaState.selected.size === pizzaState.targetCount;
  const feedback = $('#pizzaFeedback');
  feedback.className = `station-feedback show ${correct ? 'success' : 'try-again'}`;

  if (correct) {
    const suffix = pizzaState.rewarded ? ' Diese Bestellung hast du schon geschafft.' : ' +15 XP';
    feedback.textContent = `${pizzaState.successDetail}${suffix}`;
    setStationTutor('Das sieht köstlich aus! Du hast Zähler und Nenner genau richtig umgesetzt.', 'celebrating');
    if (!pizzaState.rewarded) {
      pizzaState.rewarded = true;
      recordPizzaSolved();
    }
    playTone(700, 0.18, progress.soundOn);
  } else {
    feedback.textContent = `Fast! Du hast ${pizzaState.selected.size}/${pizzaState.denominator} belegt. Gefragt war ${pizzaState.orderLabel}.`;
    setStationTutor(pizzaState.hintMessage, 'thinking');
    recordActivity();
    playTone(260, 0.18, progress.soundOn);
  }
}

export function initPizzaStation() {
  $$('[data-denominator]').forEach(button => {
    button.addEventListener('click', () => {
      pizzaState.denominator = Number(button.dataset.denominator);
      $$('[data-denominator]').forEach(item => {
        const active = item === button;
        item.classList.toggle('active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      updatePizzaOrder(true);
    });
  });

  $('#pizzaCheckButton')?.addEventListener('click', checkPizza);
  $('#pizzaNewButton')?.addEventListener('click', () => updatePizzaOrder(true));

  updatePizzaOrder(true);
}
