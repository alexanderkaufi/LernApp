const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const views = { dashboard: $('#dashboardView'), station: $('#stationView'), lesson: $('#lessonView'), result: $('#resultView') };
const stationMeta = {
  pizza: { title: 'Pizza-Bäckerei', message: 'Willkommen in meiner Bäckerei! Belege genau so viele Stücke, wie bestellt wurden.' },
  lab: { title: 'Schoko-Labor', message: 'Zieh an den Reglern. Schokolade, Bruch und Zahlenstrahl verändern sich gemeinsam!' },
  duel: { title: 'Bruch-Duell', message: 'Vergleiche die Anteile, nicht nur die Zahlen. Die Waage verrät danach das Ergebnis.' },
  quest: { title: 'Quiz-Quest', message: 'Fünf Missionen warten auf dich. Fehler sind dabei nur Hinweise fürs nächste Level.' }
};
const badgeDefinitions = [
  { id: 'firstStep', icon: '👣', name: 'Erster Schritt', hint: 'Öffne deine erste Station' },
  { id: 'pizza', icon: '🍕', name: 'Pizza-Meister', hint: 'Erfülle eine Bestellung' },
  { id: 'lab', icon: '🍫', name: 'Schoko-Forscher', hint: 'Merke dir einen Labor-Bruch' },
  { id: 'duel', icon: '⚖️', name: 'Vergleichs-Champion', hint: 'Gewinne ein Bruch-Duell' },
  { id: 'quest', icon: '🚀', name: 'Quest-Bezwinger', hint: 'Beende die Quiz-Quest' },
  { id: 'streak', icon: '🔥', name: 'Feuer-Serie', hint: 'Löse drei Aufgaben in Folge' }
];

const defaultProgress = { totalXp: 0, badges: [], visitedStations: [], labDiscoveries: [], soundOn: true };
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

// Quiz-Quest
const questions = [
  { type: 'AUFWÄRMEN', title: 'Welcher Bruch ist gefärbt?', hint: 'Zähle erst alle Teile – und dann die lila Teile.', visual: 'tiles', total: 8, filled: 3, cols: 4, answers: ['3/8', '5/8', '3/5'], correct: 0, tip: 'Oben steht die Zahl der gefärbten Teile, unten die Zahl aller Teile.' },
  { type: 'SCHNELL-CHECK', title: 'Welcher Bruch ist größer?', hint: 'Stell dir zwei gleich große Pizzen vor.', visual: 'compare', fractions: ['2/3', '2/5'], answers: ['2/3', 'Gleich groß', '2/5'], correct: 0, tip: 'Bei gleichem Zähler gilt: Je kleiner der Nenner, desto größer die Stücke.' },
  { type: 'KÜRZEN', title: 'Kürze den Bruch 6/8', hint: 'Teile Zähler und Nenner durch dieselbe Zahl.', visual: 'number', fraction: '6/8', answers: ['2/3', '3/4', '4/6'], correct: 1, tip: '6 und 8 lassen sich beide durch 2 teilen.' },
  { type: 'BILD-CHECK', title: 'Welcher Bruch ist gefärbt?', hint: 'Achte auf die Anzahl aller gleich großen Felder.', visual: 'tiles', total: 6, filled: 4, cols: 3, answers: ['4/6', '2/6', '4/2'], correct: 0, tip: 'Vier von insgesamt sechs Feldern sind lila.' },
  { type: 'FINALE', title: 'Was ist gleich viel wie 1/2?', hint: 'Erweitern verändert den Wert eines Bruchs nicht.', visual: 'compareEqual', fractions: ['1/2', '?'], answers: ['2/3', '2/4', '3/5'], correct: 1, tip: 'Multipliziere Zähler und Nenner mit derselben Zahl.' }
];
let currentQuestion = 0, score = 0, correctCount = 0, currentStreak = 0, bestStreak = 0, answered = false;
function startLesson() {
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
  else visual.innerHTML = `<div class="fraction-display">${fractionHTML(question.fractions[0])}<span class="compare-sign">${question.visual === 'compareEqual' ? '=' : 'oder'}</span>${question.fractions[1] === '?' ? '<div class="fraction-number">?</div>' : fractionHTML(question.fractions[1])}</div>`;
}
function renderQuestion() {
  answered = false; const question = questions[currentQuestion];
  $('#roundLabel').textContent = `${currentQuestion + 1} / ${questions.length}`;
  $('#lessonProgressBar').style.width = `${(currentQuestion + 1) / questions.length * 100}%`;
  $('#exerciseType').textContent = question.type; $('#lessonTitle').textContent = question.title; $('#exerciseHint').textContent = question.hint;
  $('#tutorText').textContent = ['Ein Bruch zeigt Teile von einem Ganzen. Du packst das!', 'Bleib neugierig – jeder Versuch macht dich sicherer.', 'Oha, jetzt wird es spannend! Denk in kleinen Schritten.', 'Du bist schon weit gekommen. Volle Konzentration!', 'Letzte Aufgabe – zeig, was in dir steckt!'][currentQuestion];
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
  $('#resultTitle').textContent = correctCount === 5 ? 'Du Bruch-Profi!' : correctCount >= 3 ? 'Richtig starke Runde!' : 'Mutig drangeblieben!';
  $('#resultMessage').textContent = correctCount === 5 ? 'Alles richtig! Dein Bruch-Wissen sitzt heute bombenfest.' : 'Jeder Versuch macht dich besser. Du hast heute echtes Gehirntraining geleistet!';
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
$$('[data-start]').forEach(button => button.addEventListener('click', startLesson));
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
  $$('.topic-card').forEach(card => card.classList.toggle('hidden', tab.dataset.filter !== 'all' && card.dataset.subject !== tab.dataset.filter));
}));
$$('[data-soon]').forEach(button => button.addEventListener('click', () => showToast('✨ Bald verfügbar!', 'Dieses Abenteuer bauen wir gerade für dich.')));
$('#profileButton').addEventListener('click', () => showToast('Hallo Alex! 👋', `${progress.totalXp} XP und ${progress.badges.length} Abzeichen gesammelt.`));
$('#badgeButton').addEventListener('click', openBadges); $('#badgeCloseButton').addEventListener('click', () => $('#badgeDialog').close()); $('#badgeDoneButton').addEventListener('click', () => $('#badgeDialog').close());
$('#badgeDialog').addEventListener('click', event => { if (event.target === $('#badgeDialog')) $('#badgeDialog').close(); });

// Initial state
$('#soundButton').classList.toggle('off', !progress.soundOn); $('#soundButton').textContent = progress.soundOn ? '♪' : '×';
updateProgressUI(); updatePizzaOrder(); renderLab(); newDuel();
