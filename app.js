const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const views = { dashboard: $('#dashboardView'), station: $('#stationView'), lesson: $('#lessonView'), result: $('#resultView') };
const stationMeta = {
  pizza: { title: 'Pizza-Bäckerei', message: 'Willkommen in meiner Bäckerei! Belege genau so viele Stücke, wie bestellt wurden.' },
  lab: { title: 'Schoko-Labor', message: 'Zieh an den Reglern. Schokolade, Bruch und Zahlenstrahl verändern sich gemeinsam!' },
  duel: { title: 'Bruch-Duell', message: 'Vergleiche die Anteile, nicht nur die Zahlen. Die Waage verrät danach das Ergebnis.' },
  quest: { title: 'Quiz-Quest', message: 'Zehn Missionen warten auf dich. Fehler sind dabei nur Hinweise fürs nächste Level.' }
};
const badgeDefinitions = [
  { id: 'firstStep', icon: '👣', name: 'Erster Schritt', hint: 'Öffne deine erste Station' },
  { id: 'pizza', icon: '🍕', name: 'Pizza-Meister', hint: 'Erfülle eine Bestellung' },
  { id: 'lab', icon: '🍫', name: 'Schoko-Forscher', hint: 'Merke dir einen Labor-Bruch' },
  { id: 'duel', icon: '⚖️', name: 'Vergleichs-Champion', hint: 'Gewinne ein Bruch-Duell' },
  { id: 'quest', icon: '🚀', name: 'Quest-Bezwinger', hint: 'Beende die Quiz-Quest' },
  { id: 'streak', icon: '🔥', name: 'Feuer-Serie', hint: 'Löse drei Aufgaben in Folge' }
];

const defaultProgress = { totalXp: 0, badges: [], visitedStations: [], labDiscoveries: [], soundOn: true, selectedGrade: 5 };
let progress = loadProgress();
let toastTimer;

function loadProgress() {
  try { return { ...defaultProgress, ...JSON.parse(localStorage.getItem('kluug-progress') || '{}') }; }
  catch (_) { return { ...defaultProgress }; }
}
function saveProgress() {
  try { localStorage.setItem('kluug-progress', JSON.stringify(progress)); } catch (_) { /* Storage is optional. */ }
  updateProgressUI();
}
function updateProgressUI() {
  $('#headerXp').textContent = progress.totalXp;
  $('#stationXp').textContent = progress.totalXp;
  $('#adventureCount').textContent = progress.visitedStations.length;
  renderBadges();
}
function awardXp(amount) { progress.totalXp += amount; saveProgress(); }
function unlockBadge(id) {
  if (progress.badges.includes(id)) return;
  progress.badges.push(id); saveProgress();
  const badge = badgeDefinitions.find(item => item.id === id);
  showToast(`${badge.icon} Abzeichen freigeschaltet!`, badge.name);
  playTone(760, .28);
}
function visitStation(id) {
  if (!progress.visitedStations.includes(id)) {
    progress.visitedStations.push(id); awardXp(5); unlockBadge('firstStep');
  }
}
function showView(name) {
  Object.values(views).forEach(view => view.classList.remove('active'));
  views[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showToast(title, message) {
  const toast = $('#toast');
  $('strong', toast).textContent = title; $('p', toast).textContent = message;
  toast.classList.add('show'); clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
function setTutor(message, mood = 'happy') {
  $('#stationTutorText').textContent = message;
  $('#stationFiete').classList.toggle('thinking', mood === 'thinking');
  $('#stationFiete').classList.toggle('celebrating', mood === 'celebrating');
}

const fieteReactions = [
  'High Five! ✋ Dein Gehirn ist heute richtig wach.',
  'Fun Fact: Ein halber Kuchen bleibt ein halber Kuchen – egal wie groß er ist!',
  'Hihi, das kitzelt! Jetzt aber weiterforschen.',
  'Du musst nicht schnell sein. Genau hinschauen ist viel wichtiger.',
  'Fehler entdeckt? Perfekt – jetzt weiß dein Kopf, wo er trainieren darf.'
];
let reactionIndex = 0;
function reactWithFiete(location = 'hero') {
  const message = fieteReactions[reactionIndex++ % fieteReactions.length];
  if (location === 'hero') {
    $('#heroSpeech').innerHTML = `${message}<br><strong>Weiter so!</strong>`;
    $('#heroMascot').classList.remove('high-five');
    requestAnimationFrame(() => $('#heroMascot').classList.add('high-five'));
  } else setTutor(message, 'celebrating');
  playTone(620);
}
function speak(text) {
  if (!progress.soundOn || !('speechSynthesis' in window)) {
    showToast('🔇 Vorlesen ist aus', 'Aktiviere zuerst den Ton oben rechts.'); return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replace(/[✋🔥🤗]/g, ''));
  utterance.lang = 'de-DE'; utterance.rate = .92; utterance.pitch = 1.08;
  speechSynthesis.speak(utterance);
}
function playTone(frequency, duration = .18) {
  if (!progress.soundOn) return;
  try {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audio.createOscillator(); const gain = audio.createGain();
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.frequency.value = frequency; oscillator.type = 'sine';
    gain.gain.setValueAtTime(.055, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration);
    oscillator.start(); oscillator.stop(audio.currentTime + duration);
  } catch (_) { /* Sound is optional. */ }
}
function openStation(id) { showView('station'); switchStation(id); }
function switchStation(id) {
  visitStation(id);
  $('#stationTitle').textContent = stationMeta[id].title; setTutor(stationMeta[id].message);
  $$('[data-station-tab]').forEach(button => {
    const selected = button.dataset.stationTab === id;
    button.classList.toggle('active', selected); button.setAttribute('aria-selected', String(selected));
  });
  $$('[data-panel]').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === id));
}

// Pizza-Bäckerei
const pizzaState = { denominator: 4, targetNumerator: 3, selected: new Set(), rewarded: false };
const pizzaCustomers = ['Mia', 'Bruno', 'Lina', 'Sam', 'Noah'];
function polarPoint(cx, cy, radius, angle) {
  const radians = (angle - 90) * Math.PI / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}
function pizzaSlicePath(index, total) {
  const start = polarPoint(120, 120, 102, index * 360 / total);
  const end = polarPoint(120, 120, 102, (index + 1) * 360 / total);
  return `M 120 120 L ${start.x} ${start.y} A 102 102 0 0 1 ${end.x} ${end.y} Z`;
}
function renderPizza() {
  const svg = $('#pizzaSvg');
  svg.innerHTML = `<circle cx="120" cy="120" r="111" class="pizza-crust"/>${Array.from({ length: pizzaState.denominator }, (_, index) => `<path class="pizza-slice ${pizzaState.selected.has(index) ? 'selected' : ''}" data-slice="${index}" d="${pizzaSlicePath(index, pizzaState.denominator)}" role="button" tabindex="0" aria-label="Pizzastück ${index + 1} ${pizzaState.selected.has(index) ? 'abwählen' : 'belegen'}"/>`).join('')}<circle cx="120" cy="120" r="102" class="pizza-outline"/>`;
  const toggleSlice = slice => {
    const index = Number(slice.dataset.slice);
    pizzaState.selected.has(index) ? pizzaState.selected.delete(index) : pizzaState.selected.add(index);
    renderPizza(); playTone(420 + index * 25, .1);
  };
  $$('[data-slice]', svg).forEach(slice => {
    slice.addEventListener('click', () => toggleSlice(slice));
    slice.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleSlice(slice); }
    });
  });
  $('#pizzaFraction').textContent = `${pizzaState.selected.size}/${pizzaState.denominator}`;
}
function updatePizzaOrder(randomize = false) {
  pizzaState.selected.clear();
  pizzaState.rewarded = false;
  if (randomize) pizzaState.targetNumerator = 1 + Math.floor(Math.random() * (pizzaState.denominator - 1));
  pizzaState.targetNumerator = Math.min(pizzaState.targetNumerator, pizzaState.denominator - 1);
  const customer = pizzaCustomers[Math.floor(Math.random() * pizzaCustomers.length)];
  $('#pizzaOrderText').textContent = `${customer} möchte ${pizzaState.targetNumerator} von ${pizzaState.denominator} Stücken mit Käse.`;
  $('#pizzaFeedback').className = 'station-feedback'; renderPizza();
}
function checkPizza() {
  const correct = pizzaState.selected.size === pizzaState.targetNumerator;
  const feedback = $('#pizzaFeedback');
  feedback.className = `station-feedback show ${correct ? 'success' : 'try-again'}`;
  if (correct) {
    feedback.textContent = `Perfekt belegt: ${pizzaState.targetNumerator}/${pizzaState.denominator}!${pizzaState.rewarded ? ' Diese Bestellung hast du schon geschafft.' : ' +15 XP'}`;
    setTutor('Das sieht köstlich aus! Du hast Zähler und Nenner genau richtig gelesen.', 'celebrating');
    if (!pizzaState.rewarded) { pizzaState.rewarded = true; awardXp(15); unlockBadge('pizza'); }
    playTone(700);
  } else {
    feedback.textContent = `Fast! Belegt sind ${pizzaState.selected.size}/${pizzaState.denominator}. Bestellt wurden ${pizzaState.targetNumerator}/${pizzaState.denominator}.`;
    setTutor(`Zähle die belegten Stücke noch einmal. Du brauchst genau ${pizzaState.targetNumerator}.`, 'thinking'); playTone(260);
  }
}

// Schoko-Labor
function greatestCommonDivisor(a, b) { return b ? greatestCommonDivisor(b, a % b) : a; }
function renderLab() {
  const denominator = Number($('#labDenominator').value); const numeratorInput = $('#labNumerator');
  numeratorInput.max = denominator;
  if (Number(numeratorInput.value) > denominator) numeratorInput.value = denominator;
  const numerator = Number(numeratorInput.value);
  $('#labDenominatorValue').textContent = denominator; $('#labNumeratorValue').textContent = numerator;
  $('#labFraction').textContent = `${numerator}/${denominator}`;
  $('#labDecimal').textContent = (numerator / denominator).toLocaleString('de-DE', { maximumFractionDigits: 3 });
  $('#numberMarker').style.left = `${numerator / denominator * 100}%`;
  $('#chocolateBar').style.setProperty('--choco-cols', Math.min(denominator, 6));
  $('#chocolateBar').innerHTML = Array.from({ length: denominator }, (_, index) => `<span class="${index < numerator ? 'filled' : ''}">${index < numerator ? '★' : ''}</span>`).join('');
  const divisor = greatestCommonDivisor(numerator, denominator);
  const simplified = divisor > 1 && numerator > 0 ? ` Das ist gekürzt ${numerator / divisor}/${denominator / divisor}.` : '';
  setTutor(`${numerator} von ${denominator} Teilen sind markiert.${simplified}`);
}
function rememberLabFraction() {
  const fraction = $('#labFraction').textContent;
  const isNew = !progress.labDiscoveries.includes(fraction);
  if (isNew) { progress.labDiscoveries.push(fraction); awardXp(10); unlockBadge('lab'); }
  setTutor(`Gespeichert im Forscherkopf: ${fraction}!${isNew ? ' +10 XP' : ''}`, 'celebrating');
  showToast(isNew ? '🍫 Neuer Bruch entdeckt' : '🍫 Schon im Forscherbuch', `${fraction} liegt auf dem Zahlenstrahl bei ${$('#labDecimal').textContent}.`);
}

// Bruch-Duell
let duelState = { left: [2, 3], right: [3, 5], answered: false };
function newDuel() {
  const denominatorA = 2 + Math.floor(Math.random() * 7); const denominatorB = 2 + Math.floor(Math.random() * 7);
  duelState = { left: [1 + Math.floor(Math.random() * (denominatorA - 1)), denominatorA], right: [1 + Math.floor(Math.random() * (denominatorB - 1)), denominatorB], answered: false };
  $('#leftFraction').textContent = duelState.left.join('/'); $('#rightFraction').textContent = duelState.right.join('/');
  $('#balanceArm').style.transform = 'rotate(0deg)'; $('#duelFeedback').className = 'station-feedback';
  $$('.duel-answers button').forEach(button => button.disabled = false);
  setTutor('Tipp: Du kannst beide Brüche als Teil eines gleich großen Ganzen denken.', 'thinking');
}
function duelResult() {
  const leftValue = duelState.left[0] / duelState.left[1]; const rightValue = duelState.right[0] / duelState.right[1];
  if (Math.abs(leftValue - rightValue) < .00001) return 'equal';
  return leftValue > rightValue ? 'left' : 'right';
}
function answerDuel(answer) {
  if (duelState.answered) return; duelState.answered = true;
  const result = duelResult(); const correct = result === answer;
  $('#balanceArm').style.transform = result === 'left' ? 'rotate(-8deg)' : result === 'right' ? 'rotate(8deg)' : 'rotate(0deg)';
  $$('.duel-answers button').forEach(button => button.disabled = true);
  const feedback = $('#duelFeedback'); feedback.className = `station-feedback show ${correct ? 'success' : 'try-again'}`;
  if (correct) {
    feedback.textContent = 'Richtig verglichen! Die Waage bestätigt deine Entscheidung. +15 XP';
    setTutor('Du hast nicht nur Zahlen, sondern echte Anteile verglichen. Stark!', 'celebrating');
    awardXp(15); unlockBadge('duel'); playTone(700);
  } else {
    const labels = { left: 'links', right: 'rechts', equal: 'auf beiden Seiten gleich' };
    feedback.textContent = `Guter Versuch! Tatsächlich ist es ${labels[result]}. Schau auf die gekippte Waage.`;
    setTutor('Kein Problem: Teile die Zähler durch die Nenner oder zeichne beide Brüche.', 'thinking'); playTone(260);
  }
}

// Mathe → Brüche → klassenbezogene Quiz-Quest
const questionsByGrade = {
  5: [
  { type: 'AUFWÄRMEN', title: 'Welcher Bruch ist gefärbt?', hint: 'Zähle erst alle Teile – und dann die lila Teile.', visual: 'tiles', total: 8, filled: 3, cols: 4, answers: ['3/8', '5/8', '3/5'], correct: 0, tip: 'Oben steht die Zahl der gefärbten Teile, unten die Zahl aller Teile.' },
  { type: 'SCHNELL-CHECK', title: 'Welcher Bruch ist größer?', hint: 'Stell dir zwei gleich große Pizzen vor.', visual: 'compare', fractions: ['2/3', '2/5'], answers: ['2/3', 'Gleich groß', '2/5'], correct: 0, tip: 'Bei gleichem Zähler gilt: Je kleiner der Nenner, desto größer die Stücke.' },
  { type: 'KÜRZEN', title: 'Kürze den Bruch 6/8', hint: 'Teile Zähler und Nenner durch dieselbe Zahl.', visual: 'number', fraction: '6/8', answers: ['2/3', '3/4', '4/6'], correct: 1, tip: '6 und 8 lassen sich beide durch 2 teilen.' },
  { type: 'BILD-CHECK', title: 'Welcher Bruch ist gefärbt?', hint: 'Achte auf die Anzahl aller gleich großen Felder.', visual: 'tiles', total: 6, filled: 4, cols: 3, answers: ['4/6', '2/6', '4/2'], correct: 0, tip: 'Vier von insgesamt sechs Feldern sind lila.' },
  { type: 'GLEICHWERTIG', title: 'Was ist gleich viel wie 1/2?', hint: 'Erweitern verändert den Wert eines Bruchs nicht.', visual: 'compareEqual', fractions: ['1/2', '?'], answers: ['2/3', '2/4', '3/5'], correct: 1, tip: 'Multipliziere Zähler und Nenner mit derselben Zahl.' },
    { type: 'BILD-CHECK', title: 'Welcher Bruch ist gefärbt?', hint: 'Zähle alle zehn Felder sorgfältig.', visual: 'tiles', total: 10, filled: 7, cols: 5, answers: ['7/10', '3/10', '7/3'], correct: 0, tip: 'Sieben von zehn Feldern sind gefärbt: 7/10.' },
    { type: 'VERGLEICHEN', title: 'Welcher Bruch ist am kleinsten?', hint: 'Alle drei Brüche sind Teile desselben Ganzen.', visual: 'expression', equation: '1/4  ·  1/2  ·  3/4', answers: ['1/4', '1/2', '3/4'], correct: 0, tip: 'Ein Viertel ist kleiner als eine Hälfte und drei Viertel.' },
    { type: 'UMWANDELN', title: 'Wandle die gemischte Zahl um', hint: 'Ein Ganzes sind zwei Halbe.', visual: 'expression', equation: '1 1/2 = ?', answers: ['2/2', '3/2', '3/1'], correct: 1, tip: '1 Ganzes sind 2/2. Plus 1/2 ergibt 3/2.' },
    { type: 'ANTEIL BERECHNEN', title: 'Was sind 3/4 von 12?', hint: 'Teile 12 zuerst in vier gleich große Gruppen.', visual: 'expression', equation: '3/4 von 12', answers: ['3', '8', '9'], correct: 2, tip: '12 : 4 = 3 und 3 · 3 = 9.' },
    { type: 'FINALE', title: 'Sechs von acht Stücken sind weg', hint: 'Welcher Anteil des Kuchens wurde gegessen?', visual: 'expression', equation: '6 von 8 Stücken', answers: ['1/4', '3/4', '6/2'], correct: 1, tip: '6/8 lässt sich durch 2 kürzen und ergibt 3/4.' }
  ],
  6: [
    { type: 'KÜRZEN', title: 'Kürze vollständig', hint: 'Finde eine Zahl, die Zähler und Nenner teilt.', visual: 'number', fraction: '18/24', answers: ['3/4', '6/8', '9/12'], correct: 0, tip: 'Teile 18 und 24 durch 6. So erhältst du 3/4.' },
    { type: 'ERWEITERN', title: 'Erweitere auf den Nenner 20', hint: 'Mit welcher Zahl wird 5 zu 20?', visual: 'expression', equation: '3/5 = ?/20', answers: ['9/20', '12/20', '15/20'], correct: 1, tip: '5 · 4 = 20, also rechnest du auch 3 · 4 = 12.' },
    { type: 'ADDIEREN', title: 'Addiere gleichnamige Brüche', hint: 'Der Nenner bleibt gleich.', visual: 'expression', equation: '1/4 + 2/4', answers: ['3/8', '3/4', '2/4'], correct: 1, tip: 'Addiere die Zähler 1 + 2. Der gemeinsame Nenner 4 bleibt.' },
    { type: 'ADDIEREN', title: 'Mache die Brüche zuerst gleichnamig', hint: '1/6 passt auch zum Nenner 6.', visual: 'expression', equation: '2/3 + 1/6', answers: ['3/9', '5/6', '3/6'], correct: 1, tip: '2/3 sind 4/6. Zusammen mit 1/6 ergibt das 5/6.' },
    { type: 'SUBTRAHIEREN', title: 'Subtrahiere und kürze', hint: 'Ziehe erst die Zähler voneinander ab.', visual: 'expression', equation: '7/8 − 3/8', answers: ['1/2', '4/5', '3/8'], correct: 0, tip: '7/8 − 3/8 = 4/8. Vollständig gekürzt ist das 1/2.' },
    { type: 'ADDIEREN', title: 'Addiere gleichnamige Brüche', hint: 'Die Nenner bleiben unverändert.', visual: 'expression', equation: '3/7 + 2/7', answers: ['5/14', '5/7', '1/7'], correct: 1, tip: '3 + 2 = 5. Der gemeinsame Nenner bleibt 7.' },
    { type: 'SUBTRAHIEREN', title: 'Mache zuerst gleichnamig', hint: 'Wandle 1/3 in Sechstel um.', visual: 'expression', equation: '5/6 − 1/3', answers: ['4/3', '1/2', '4/6'], correct: 1, tip: '1/3 = 2/6. 5/6 − 2/6 = 3/6 = 1/2.' },
    { type: 'UMWANDELN', title: 'Mache daraus einen unechten Bruch', hint: 'Zwei Ganze sind acht Viertel.', visual: 'expression', equation: '2 1/4 = ?', answers: ['3/4', '8/4', '9/4'], correct: 2, tip: '2 Ganze sind 8/4. Plus 1/4 ergibt 9/4.' },
    { type: 'ANTEIL BERECHNEN', title: 'Was sind 3/5 von 20?', hint: 'Teile 20 zuerst durch 5.', visual: 'expression', equation: '3/5 von 20', answers: ['12', '15', '4'], correct: 0, tip: '20 : 5 = 4 und 4 · 3 = 12.' },
    { type: 'FINALE', title: 'Welcher Bruch ist 0,75?', hint: '75 Hundertstel lassen sich kürzen.', visual: 'expression', equation: '0,75 = ?', answers: ['3/4', '7/5', '1/4'], correct: 0, tip: '0,75 = 75/100. Gekürzt durch 25 ergibt das 3/4.' }
  ],
  7: [
    { type: 'MULTIPLIZIEREN', title: 'Multipliziere die Brüche', hint: 'Zähler mal Zähler, Nenner mal Nenner – danach kürzen.', visual: 'expression', equation: '2/3 · 3/4', answers: ['1/2', '6/7', '2/4'], correct: 0, tip: '6/12 lässt sich vollständig zu 1/2 kürzen.' },
    { type: 'DIVIDIEREN', title: 'Teile durch einen Bruch', hint: 'Multipliziere mit dem Kehrwert des zweiten Bruchs.', visual: 'expression', equation: '5/6 : 10/9', answers: ['3/4', '4/3', '1/2'], correct: 0, tip: '5/6 · 9/10 = 45/60 = 3/4.' },
    { type: 'NEGATIVE BRÜCHE', title: 'Welcher Wert ist größer?', hint: 'Auf der Zahlengeraden ist weiter rechts immer größer.', visual: 'compare', fractions: ['−2/3', '−3/4'], answers: ['−2/3', 'Gleich groß', '−3/4'], correct: 0, tip: '−2/3 liegt näher an null als −3/4 und ist deshalb größer.' },
    { type: 'ADDIEREN', title: 'Rechne mit Vorzeichen', hint: 'Die Nenner sind schon gleich.', visual: 'expression', equation: '−3/5 + 1/5', answers: ['−4/5', '−2/5', '2/5'], correct: 1, tip: '−3 + 1 = −2. Der Nenner bleibt 5.' },
    { type: 'GEMISCHTE ZAHL', title: 'Rechne mit einer gemischten Zahl', hint: 'Wandle 1 1/2 zuerst in 3/2 um.', visual: 'expression', equation: '1 1/2 · 2/3', answers: ['1', '3/5', '2'], correct: 0, tip: '3/2 · 2/3 = 6/6 = 1.' },
    { type: 'MULTIPLIZIEREN', title: 'Kürze geschickt vor dem Rechnen', hint: '15 und 5 sowie 4 und 8 lassen sich kürzen.', visual: 'expression', equation: '4/5 · 15/8', answers: ['3/2', '60/13', '2/3'], correct: 0, tip: '4/8 = 1/2 und 15/5 = 3. Übrig bleibt 3/2.' },
    { type: 'DIVIDIEREN', title: 'Multipliziere mit dem Kehrwert', hint: 'Der Kehrwert von 1/2 ist 2/1.', visual: 'expression', equation: '3/4 : 1/2', answers: ['3/8', '3/2', '2/3'], correct: 1, tip: '3/4 · 2/1 = 6/4 = 3/2.' },
    { type: 'VORZEICHEN', title: 'Subtrahiere einen positiven Bruch', hint: 'Mache aus 1/2 zuerst 2/4.', visual: 'expression', equation: '−1/2 − 1/4', answers: ['−1/4', '−3/4', '3/4'], correct: 1, tip: '−2/4 − 1/4 = −3/4.' },
    { type: 'KEHRWERT', title: 'Wie lautet der Kehrwert?', hint: 'Vertausche Zähler und Nenner.', visual: 'number', fraction: '7/9', answers: ['9/7', '−7/9', '2/16'], correct: 0, tip: 'Beim Kehrwert von 7/9 werden Zähler und Nenner vertauscht: 9/7.' },
    { type: 'FINALE', title: 'Berechne den Anteil', hint: 'Teile 48 durch 8 und nimm davon fünf Teile.', visual: 'expression', equation: '5/8 von 48', answers: ['30', '35', '28'], correct: 0, tip: '48 : 8 = 6 und 6 · 5 = 30.' }
  ],
  8: [
    { type: 'GLEICHUNG', title: 'Bestimme x', hint: 'Multipliziere beide Seiten mit 4.', visual: 'expression', equation: 'x/4 = 3/5', answers: ['12/5', '3/20', '7/5'], correct: 0, tip: 'x = 4 · 3/5 = 12/5.' },
    { type: 'KLAMMER', title: 'Beachte die Reihenfolge', hint: 'Rechne zuerst in der Klammer.', visual: 'expression', equation: '(3/4 + 1/2) · 2', answers: ['5/2', '7/4', '2'], correct: 0, tip: '1/2 = 2/4. In der Klammer stehen 5/4, mal 2 ergibt 5/2.' },
    { type: 'BRUCHTERM', title: 'Kürze den Term', hint: '6 und 9 haben einen gemeinsamen Teiler.', visual: 'expression', equation: '6x/9', answers: ['2x/3', '3x/2', '2x/9'], correct: 0, tip: 'Teile Zähler und Nenner durch 3: 6x/9 = 2x/3.' },
    { type: 'PROZENT-CHECK', title: 'Wie viel Prozent sind 7/8?', hint: 'Berechne 7 : 8 und multipliziere mit 100.', visual: 'number', fraction: '7/8', answers: ['78 %', '87,5 %', '80 %'], correct: 1, tip: '7 : 8 = 0,875. Das sind 87,5 %.' },
    { type: 'GLEICHUNG', title: 'Löse die Bruchgleichung', hint: 'Multipliziere beide Seiten zuerst mit 6.', visual: 'expression', equation: 'x/3 + 1/6 = 5/6', answers: ['2', '4/3', '5/3'], correct: 0, tip: '2x + 1 = 5, also 2x = 4 und x = 2.' },
    { type: 'GLEICHUNG', title: 'Befreie den Term vom Nenner', hint: 'Multipliziere beide Seiten mit 3.', visual: 'expression', equation: '(x − 1)/3 = 2', answers: ['5', '7', '3'], correct: 1, tip: 'x − 1 = 6. Addiere 1 und du erhältst x = 7.' },
    { type: 'GLEICHUNG', title: 'Bestimme den Nenner x', hint: 'Kreuzmultiplizieren hilft.', visual: 'expression', equation: '2/x = 1/4', answers: ['6', '8', '2'], correct: 1, tip: '2 · 4 = x · 1, also ist x = 8.' },
    { type: 'BRUCHTERM', title: 'Vereinfache für x ≠ 0', hint: 'Ein Faktor x steht oben und unten.', visual: 'expression', equation: '3x²/6x', answers: ['x/2', 'x/3', '3x/6'], correct: 0, tip: 'Kürze x und teile 3 durch 6. Übrig bleibt x/2.' },
    { type: 'SACHRECHNEN', title: 'Finde die ganze Zahl', hint: 'Drei Viertel einer Zahl ergeben 24.', visual: 'expression', equation: '3/4 · x = 24', answers: ['18', '32', '36'], correct: 1, tip: '24 : 3 · 4 = 32.' },
    { type: 'FINALE', title: 'Wandle in Prozent um', hint: 'Berechne 3 : 8 und multipliziere mit 100.', visual: 'number', fraction: '3/8', answers: ['37,5 %', '38 %', '62,5 %'], correct: 0, tip: '3 : 8 = 0,375. Das entspricht 37,5 %.' }
  ]
};

const gradeContent = {
  5: { level: 'GRUNDLAGEN', title: 'Brüche verstehen', description: 'Teile erkennen, darstellen und einfache Brüche vergleichen.', lessons: '12 Lektionen', quest: 'Zeig, wie sicher du Bruchteile schon erkennst.', intro: 'Zähle zuerst alle Teile und dann die markierten. Ganz ruhig – du packst das!' },
  6: { level: 'RECHNEN', title: 'Mit Brüchen rechnen', description: 'Kürzen, erweitern, addieren und subtrahieren.', lessons: '14 Lektionen', quest: 'Rechne dich durch Kürzen, Erweitern, Plus und Minus.', intro: 'Suche den größten gemeinsamen Teiler. Damit wird der Bruch sofort übersichtlicher!' },
  7: { level: 'FORTGESCHRITTEN', title: 'Brüche & Vorzeichen', description: 'Multiplizieren, dividieren und negative Brüche meistern.', lessons: '13 Lektionen', quest: 'Stelle dich Produkten, Quotienten und negativen Brüchen.', intro: 'Die Regel kennst du: Zähler mal Zähler, Nenner mal Nenner. Danach clever kürzen!' },
  8: { level: 'BRUCHTERME', title: 'Bruchterme & Gleichungen', description: 'Bruchterme vereinfachen und Gleichungen lösen.', lessons: '11 Lektionen', quest: 'Knacke Bruchterme, Prozente und Gleichungen.', intro: 'Behandle den Bruch wie eine Gleichung: dieselbe Operation auf beiden Seiten. Los geht’s!' }
};

$('#gradeSelect').value = String(progress.selectedGrade || 5);
let selectedGrade = Number($('#gradeSelect').value);
let activeSubject = 'all';
let questions = questionsByGrade[selectedGrade];
let currentQuestion = 0, score = 0, correctCount = 0, currentStreak = 0, bestStreak = 0, answered = false;

function updateGradeContent() {
  selectedGrade = Number($('#gradeSelect').value);
  progress.selectedGrade = selectedGrade;
  saveProgress();
  questions = questionsByGrade[selectedGrade];
  const content = gradeContent[selectedGrade];
  $('#adventureGrade').textContent = `KLASSE ${selectedGrade}`;
  $('#adventureSubtitle').textContent = content.description;
  $('#levelPill').textContent = content.level;
  $('#fractionTopicLabel').textContent = `MATHE · KLASSE ${selectedGrade}`;
  $('#fractionTopicTitle').textContent = content.title;
  $('#fractionTopicDescription').textContent = content.description;
  $('#fractionLessonCount').textContent = content.lessons;
  $('#continueContext').textContent = `MATHE · KLASSE ${selectedGrade} · WEITERMACHEN`;
  $('#continueTitle').textContent = content.title;
  $('#continueSubtitle').textContent = `${content.level.charAt(0)}${content.level.slice(1).toLowerCase()} · Quiz mit ${questions.length} Aufgaben`;
  $('#stationContextLabel').textContent = `MATHE · BRÜCHE · KLASSE ${selectedGrade}`;
  $('#questGradeLabel').textContent = `QUIZ-QUEST · KLASSE ${selectedGrade}`;
  $('#questDescription').textContent = content.quest;
  $('#lessonLevelLabel').textContent = `BRÜCHE · KLASSE ${selectedGrade} · ${content.level}`;
  applyDashboardFilters();
}

function applyDashboardFilters() {
  $$('.topic-card').forEach(card => {
    const subjectMatches = activeSubject === 'all' || card.dataset.subject === activeSubject;
    const gradeMatches = !card.dataset.grades || card.dataset.grades.split(',').includes(String(selectedGrade));
    card.classList.toggle('hidden', !subjectMatches || !gradeMatches);
  });
  $('#mathAdventure').classList.toggle('hidden', activeSubject !== 'all' && activeSubject !== 'mathe');
}

function openMathLearning() {
  activeSubject = 'mathe';
  $$('.subject-tab').forEach(tab => {
    const selected = tab.dataset.filter === 'mathe';
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
  });
  applyDashboardFilters();
  $('#mathAdventure').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function startLesson() {
  questions = questionsByGrade[selectedGrade];
  visitStation('quest'); currentQuestion = 0; score = 0; correctCount = 0; currentStreak = 0; bestStreak = 0;
  $('#scoreValue').textContent = '0'; $('#lessonStreak').textContent = '0'; showView('lesson'); renderQuestion();
}
function fractionHTML(value) {
  const [top, bottom] = value.split('/'); return `<div class="fraction-number"><span>${top}</span><span>${bottom}</span></div>`;
}
function renderVisual(question) {
  const visual = $('#visualQuestion');
  if (question.visual === 'tiles') visual.innerHTML = `<div class="fraction-grid" style="--cols:${question.cols}">${Array.from({ length: question.total }, (_, index) => `<span class="fraction-tile ${index < question.filled ? 'filled' : ''}"></span>`).join('')}</div>`;
  else if (question.visual === 'number') visual.innerHTML = fractionHTML(question.fraction);
  else if (question.visual === 'expression') visual.innerHTML = `<div class="math-expression">${question.equation}</div>`;
  else visual.innerHTML = `<div class="fraction-display">${fractionHTML(question.fractions[0])}<span class="compare-sign">${question.visual === 'compareEqual' ? '=' : 'oder'}</span>${question.fractions[1] === '?' ? '<div class="fraction-number">?</div>' : fractionHTML(question.fractions[1])}</div>`;
}
function renderQuestion() {
  answered = false; const question = questions[currentQuestion];
  $('#roundLabel').textContent = `${currentQuestion + 1} / ${questions.length}`;
  $('#lessonProgressBar').style.width = `${(currentQuestion + 1) / questions.length * 100}%`;
  $('#exerciseType').textContent = question.type; $('#lessonTitle').textContent = question.title; $('#exerciseHint').textContent = question.hint;
  const tutorPrompts = [
    gradeContent[selectedGrade].intro,
    'Bleib neugierig – jeder Versuch macht dich sicherer.',
    'Oha, jetzt wird es spannend! Denk in kleinen Schritten.',
    'Drei geschafft! Dein Gehirn ist schon warmgelaufen.',
    'Fast Halbzeit – bleib locker und schau genau hin.',
    'Halbzeit! Atme kurz durch. Du machst das richtig gut.',
    'Jetzt kommt dein Bruchwissen richtig in Fahrt!',
    'Nur noch drei. Fehler sind erlaubt, Aufgeben nicht nötig.',
    'Vorletzte Aufgabe – du bist stärker als am Anfang.',
    'Finale! Zeig der letzten Aufgabe, was du kannst.'
  ];
  $('#tutorText').textContent = tutorPrompts[currentQuestion];
  $('#lessonMascot').classList.remove('sad'); $('#feedback').className = 'feedback'; renderVisual(question);
  $('#answers').innerHTML = question.answers.map((answer, index) => `<button class="answer-button" data-answer="${index}">${answer.includes('/') ? fractionHTML(answer) : answer}</button>`).join('');
  $$('[data-answer]', $('#answers')).forEach(button => button.addEventListener('click', () => checkAnswer(Number(button.dataset.answer))));
}
function checkAnswer(index) {
  if (answered) return; answered = true;
  const question = questions[currentQuestion]; const correct = index === question.correct; const buttons = $$('.answer-button');
  buttons.forEach(button => button.disabled = true); buttons[index].classList.add('selected', correct ? 'correct' : 'wrong');
  if (!correct) buttons[question.correct].classList.add('reveal');
  $('#feedback').classList.add('show');
  if (correct) {
    score += 20; correctCount++; currentStreak++; bestStreak = Math.max(bestStreak, currentStreak);
    $('#feedbackIcon').textContent = '✓'; $('#feedbackTitle').textContent = ['Yes! Genau richtig!', 'Klasse gedacht!', 'Bäm – du hast es!', 'Super aufgepasst!'][currentQuestion % 4];
    $('#feedbackText').textContent = `+20 XP · ${question.tip}`; $('#tutorText').textContent = currentStreak > 1 ? `${currentStreak} am Stück! Du bist im Flow! 🔥` : 'Siehst du? Dein Kopf kann das!';
    if (currentStreak >= 3) unlockBadge('streak'); playTone(560);
  } else {
    currentStreak = 0; $('#feedback').classList.add('wrong'); $('#feedbackIcon').textContent = '↻'; $('#feedbackTitle').textContent = 'Fast! Kein Problem.';
    $('#feedbackText').textContent = question.tip; $('#tutorText').textContent = 'Fehler sind Trainingspunkte fürs Gehirn. Schau dir die grün markierte Lösung an!';
    $('#lessonMascot').classList.add('sad'); playTone(250);
  }
  $('#scoreValue').textContent = score; $('#lessonStreak').textContent = currentStreak;
}
function nextQuestion() {
  if (!answered) return;
  if (currentQuestion < questions.length - 1) { currentQuestion++; renderQuestion(); return; }
  $('#resultCorrect').textContent = `${correctCount}/${questions.length}`; $('#resultXp').textContent = score; $('#bestStreak').textContent = bestStreak;
  const perfectRound = correctCount === questions.length;
  $('#resultTitle').textContent = perfectRound ? 'Du Bruch-Profi!' : correctCount >= Math.ceil(questions.length * .6) ? 'Richtig starke Runde!' : 'Mutig drangeblieben!';
  $('#resultMessage').textContent = perfectRound ? 'Alles richtig! Dein Bruch-Wissen sitzt heute bombenfest.' : 'Jeder Versuch macht dich besser. Du hast heute echtes Gehirntraining geleistet!';
  awardXp(score); unlockBadge('quest'); createConfetti(); showView('result'); playTone(720, .3);
}
function createConfetti() {
  $('#confetti').innerHTML = Array.from({ length: 35 }, (_, index) => `<i style="left:${index * 37 % 100}%;animation-delay:${index % 10 * .12}s;transform:rotate(${index * 17}deg)"></i>`).join('');
}
function renderBadges() {
  $('#badgeGrid').innerHTML = badgeDefinitions.map(badge => {
    const unlocked = progress.badges.includes(badge.id);
    return `<article class="badge-item ${unlocked ? 'unlocked' : 'locked'}"><span>${unlocked ? badge.icon : '🔒'}</span><strong>${badge.name}</strong><small>${unlocked ? 'Geschafft!' : badge.hint}</small></article>`;
  }).join('');
}
function openBadges() { renderBadges(); if (typeof $('#badgeDialog').showModal === 'function') $('#badgeDialog').showModal(); }

// Navigation and events
$('#homeButton').addEventListener('click', () => showView('dashboard'));
$('#backButton').addEventListener('click', () => showView('dashboard'));
$('#stationBackButton').addEventListener('click', () => showView('dashboard'));
$('#resultHomeButton').addEventListener('click', () => showView('dashboard'));
$('#continueButton').addEventListener('click', startLesson);
$$('[data-open-math]').forEach(button => button.addEventListener('click', openMathLearning));
$('#againButton').addEventListener('click', startLesson); $('#nextButton').addEventListener('click', nextQuestion); $('#questStartButton').addEventListener('click', startLesson);
$$('[data-station]').forEach(button => button.addEventListener('click', () => openStation(button.dataset.station)));
$$('[data-station-tab]').forEach(button => button.addEventListener('click', () => switchStation(button.dataset.stationTab)));
$('#heroMascot').addEventListener('click', () => reactWithFiete('hero')); $('#stationFiete').addEventListener('click', () => reactWithFiete('station'));
$('#heroSpeakButton').addEventListener('click', () => speak($('#heroSpeech').textContent)); $('#stationSpeakButton').addEventListener('click', () => speak($('#stationTutorText').textContent));
$('#soundButton').addEventListener('click', event => {
  progress.soundOn = !progress.soundOn; saveProgress();
  event.currentTarget.classList.toggle('off', !progress.soundOn); event.currentTarget.textContent = progress.soundOn ? '♪' : '×';
  event.currentTarget.setAttribute('aria-pressed', String(progress.soundOn)); event.currentTarget.setAttribute('aria-label', progress.soundOn ? 'Ton ausschalten' : 'Ton einschalten');
  if (!progress.soundOn && 'speechSynthesis' in window) speechSynthesis.cancel();
});
$$('[data-denominator]').forEach(button => button.addEventListener('click', () => {
  pizzaState.denominator = Number(button.dataset.denominator); pizzaState.targetNumerator = Math.min(pizzaState.targetNumerator, pizzaState.denominator - 1);
  $$('[data-denominator]').forEach(item => item.classList.toggle('active', item === button)); updatePizzaOrder();
}));
$('#pizzaCheckButton').addEventListener('click', checkPizza); $('#pizzaNewButton').addEventListener('click', () => updatePizzaOrder(true));
$('#labDenominator').addEventListener('input', renderLab); $('#labNumerator').addEventListener('input', renderLab); $('#labCelebrateButton').addEventListener('click', rememberLabFraction);
$$('[data-duel]').forEach(button => button.addEventListener('click', () => answerDuel(button.dataset.duel))); $('#newDuelButton').addEventListener('click', newDuel);
$$('.subject-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.subject-tab').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
  activeSubject = tab.dataset.filter;
  applyDashboardFilters();
}));
$('#gradeSelect').addEventListener('change', updateGradeContent);
$$('[data-soon]').forEach(button => button.addEventListener('click', () => showToast('✨ Bald verfügbar!', 'Dieses Abenteuer bauen wir gerade für dich.')));
$('#profileButton').addEventListener('click', () => showToast('Hallo Alex! 👋', `${progress.totalXp} XP und ${progress.badges.length} Abzeichen gesammelt.`));
$('#badgeButton').addEventListener('click', openBadges); $('#badgeCloseButton').addEventListener('click', () => $('#badgeDialog').close()); $('#badgeDoneButton').addEventListener('click', () => $('#badgeDialog').close());
$('#badgeDialog').addEventListener('click', event => { if (event.target === $('#badgeDialog')) $('#badgeDialog').close(); });

// Initial state
$('#soundButton').classList.toggle('off', !progress.soundOn); $('#soundButton').textContent = progress.soundOn ? '♪' : '×';
updateProgressUI(); updatePizzaOrder(); renderLab(); newDuel();
updateGradeContent();
