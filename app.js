const views = {
  dashboard: document.querySelector('#dashboardView'),
  lesson: document.querySelector('#lessonView'),
  result: document.querySelector('#resultView')
};

const questions = [
  { type: 'AUFWÄRMEN', title: 'Welcher Bruch ist gefärbt?', hint: 'Zähle erst alle Teile – und dann die lila Teile.', visual: 'tiles', total: 8, filled: 3, cols: 4, answers: ['3/8', '5/8', '3/5'], correct: 0, tip: 'Oben steht die Zahl der gefärbten Teile, unten die Zahl aller Teile.' },
  { type: 'SCHNELL-CHECK', title: 'Welcher Bruch ist größer?', hint: 'Stell dir zwei gleich große Pizzen vor.', visual: 'compare', fractions: ['2/3', '2/5'], answers: ['2/3', 'Gleich groß', '2/5'], correct: 0, tip: 'Bei gleichem Zähler gilt: Je kleiner der Nenner, desto größer die Stücke.' },
  { type: 'KÜRZEN', title: 'Kürze den Bruch 6/8', hint: 'Teile Zähler und Nenner durch dieselbe Zahl.', visual: 'number', fraction: '6/8', answers: ['2/3', '3/4', '4/6'], correct: 1, tip: '6 und 8 lassen sich beide durch 2 teilen.' },
  { type: 'BILD-CHECK', title: 'Welcher Bruch ist gefärbt?', hint: 'Achte auf die Anzahl aller gleich großen Felder.', visual: 'tiles', total: 6, filled: 4, cols: 3, answers: ['4/6', '2/6', '4/2'], correct: 0, tip: 'Vier von insgesamt sechs Feldern sind lila.' },
  { type: 'FINALE', title: 'Was ist gleich viel wie 1/2?', hint: 'Erweitern verändert den Wert eines Bruchs nicht.', visual: 'compareEqual', fractions: ['1/2', '?'], answers: ['2/3', '2/4', '3/5'], correct: 1, tip: 'Multipliziere Zähler und Nenner mit derselben Zahl.' }
];

let currentQuestion = 0;
let score = 0;
let correctCount = 0;
let currentStreak = 0;
let bestStreak = 0;
let soundOn = true;
let answered = false;

function showView(name) {
  Object.values(views).forEach(view => view.classList.remove('active'));
  views[name].classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function startLesson() {
  currentQuestion = 0; score = 0; correctCount = 0; currentStreak = 0; bestStreak = 0;
  document.querySelector('#scoreValue').textContent = '0';
  document.querySelector('#lessonStreak').textContent = '0';
  showView('lesson');
  renderQuestion();
}

function fractionHTML(value) {
  const [top, bottom] = value.split('/');
  return `<div class="fraction-number"><span>${top}</span><span>${bottom}</span></div>`;
}

function renderVisual(question) {
  const visual = document.querySelector('#visualQuestion');
  if (question.visual === 'tiles') {
    visual.innerHTML = `<div class="fraction-grid" style="--cols:${question.cols}">${Array.from({ length: question.total }, (_, i) => `<span class="fraction-tile ${i < question.filled ? 'filled' : ''}"></span>`).join('')}</div>`;
  } else if (question.visual === 'number') {
    visual.innerHTML = fractionHTML(question.fraction);
  } else {
    visual.innerHTML = `<div class="fraction-display">${fractionHTML(question.fractions[0])}<span class="compare-sign">${question.visual === 'compareEqual' ? '=' : 'oder'}</span>${question.fractions[1] === '?' ? '<div class="fraction-number">?</div>' : fractionHTML(question.fractions[1])}</div>`;
  }
}

function renderQuestion() {
  answered = false;
  const question = questions[currentQuestion];
  document.querySelector('#roundLabel').textContent = `${currentQuestion + 1} / ${questions.length}`;
  document.querySelector('#lessonProgressBar').style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  document.querySelector('#exerciseType').textContent = question.type;
  document.querySelector('#lessonTitle').textContent = question.title;
  document.querySelector('#exerciseHint').textContent = question.hint;
  document.querySelector('#tutorText').textContent = currentQuestion === 0 ? 'Ein Bruch zeigt Teile von einem Ganzen. Du packst das – schau genau hin!' : ['Bleib neugierig – jeder Versuch macht dich sicherer.', 'Oha, jetzt wird’s spannend! Denk in kleinen Schritten.', 'Du bist schon weit gekommen. Volle Konzentration!', 'Letzte Aufgabe – zeig, was in dir steckt!'][currentQuestion - 1];
  document.querySelector('#lessonMascot').classList.remove('sad');
  const feedback = document.querySelector('#feedback');
  feedback.className = 'feedback';
  renderVisual(question);
  const answers = document.querySelector('#answers');
  answers.innerHTML = question.answers.map((answer, index) => `<button class="answer-button" data-answer="${index}">${answer.includes('/') ? fractionHTML(answer) : answer}</button>`).join('');
  answers.querySelectorAll('button').forEach(button => button.addEventListener('click', () => checkAnswer(Number(button.dataset.answer))));
}

function checkAnswer(index) {
  if (answered) return;
  answered = true;
  const question = questions[currentQuestion];
  const isCorrect = index === question.correct;
  const buttons = document.querySelectorAll('.answer-button');
  buttons.forEach(button => { button.disabled = true; });
  buttons[index].classList.add('selected', isCorrect ? 'correct' : 'wrong');
  if (!isCorrect) buttons[question.correct].classList.add('reveal');

  const feedback = document.querySelector('#feedback');
  feedback.classList.add('show');
  if (isCorrect) {
    score += 20; correctCount++; currentStreak++; bestStreak = Math.max(bestStreak, currentStreak);
    document.querySelector('#feedbackIcon').textContent = '✓';
    document.querySelector('#feedbackTitle').textContent = ['Yes! Genau richtig!', 'Klasse gedacht!', 'Bäm – du hast es!', 'Super aufgepasst!'][currentQuestion % 4];
    document.querySelector('#feedbackText').textContent = `+20 XP · ${question.tip}`;
    document.querySelector('#tutorText').textContent = currentStreak > 1 ? `${currentStreak} am Stück! Du bist gerade richtig im Flow! 🔥` : 'Siehst du? Dein Kopf kann das! Richtig stark.';
    playTone(560);
  } else {
    currentStreak = 0;
    feedback.classList.add('wrong');
    document.querySelector('#feedbackIcon').textContent = '↻';
    document.querySelector('#feedbackTitle').textContent = 'Fast! Kein Problem.';
    document.querySelector('#feedbackText').textContent = question.tip;
    document.querySelector('#tutorText').textContent = 'Fehler sind Trainingspunkte fürs Gehirn. Schau dir die grün markierte Lösung kurz an – dann sitzt es!';
    document.querySelector('#lessonMascot').classList.add('sad');
    playTone(250);
  }
  document.querySelector('#scoreValue').textContent = score;
  document.querySelector('#lessonStreak').textContent = currentStreak;
}

function nextQuestion() {
  if (!answered) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    document.querySelector('#resultCorrect').textContent = `${correctCount}/${questions.length}`;
    document.querySelector('#resultXp').textContent = score;
    document.querySelector('#bestStreak').textContent = bestStreak;
    document.querySelector('#resultTitle').textContent = correctCount === 5 ? 'Du Bruch-Profi!' : correctCount >= 3 ? 'Richtig starke Runde!' : 'Mutig drangeblieben!';
    document.querySelector('#resultMessage').textContent = correctCount === 5 ? 'Alles richtig! Dein Bruch-Wissen sitzt heute bombenfest.' : 'Jeder Versuch macht dich besser. Du hast heute echtes Gehirntraining geleistet!';
    createConfetti();
    showView('result');
    playTone(720);
  }
}

function createConfetti() {
  const confetti = document.querySelector('#confetti');
  confetti.innerHTML = Array.from({length: 35}, (_, i) => `<i style="left:${(i * 37) % 100}%;animation-delay:${(i % 10) * .12}s;transform:rotate(${i * 17}deg)"></i>`).join('');
}

function playTone(frequency) {
  if (!soundOn) return;
  try {
    const audio = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();
    oscillator.connect(gain); gain.connect(audio.destination);
    oscillator.frequency.value = frequency; oscillator.type = 'sine';
    gain.gain.setValueAtTime(.06, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .18);
    oscillator.start(); oscillator.stop(audio.currentTime + .18);
  } catch (_) { /* Sound is optional. */ }
}

function goHome() { showView('dashboard'); }
document.querySelector('#homeButton').addEventListener('click', goHome);
document.querySelector('#backButton').addEventListener('click', goHome);
document.querySelector('#resultHomeButton').addEventListener('click', goHome);
document.querySelector('#continueButton').addEventListener('click', startLesson);
document.querySelectorAll('[data-start]').forEach(button => button.addEventListener('click', startLesson));
document.querySelector('#againButton').addEventListener('click', startLesson);
document.querySelector('#nextButton').addEventListener('click', nextQuestion);

document.querySelector('#soundButton').addEventListener('click', event => {
  soundOn = !soundOn;
  event.currentTarget.classList.toggle('off', !soundOn);
  event.currentTarget.textContent = soundOn ? '♪' : '×';
  event.currentTarget.setAttribute('aria-pressed', String(soundOn));
  event.currentTarget.setAttribute('aria-label', soundOn ? 'Ton ausschalten' : 'Ton einschalten');
});

document.querySelectorAll('.subject-tab').forEach(tab => tab.addEventListener('click', () => {
  document.querySelectorAll('.subject-tab').forEach(item => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
  document.querySelectorAll('.topic-card').forEach(card => card.classList.toggle('hidden', tab.dataset.filter !== 'all' && card.dataset.subject !== tab.dataset.filter));
}));

const toast = document.querySelector('#toast');
document.querySelectorAll('[data-soon]').forEach(button => button.addEventListener('click', () => {
  toast.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}));
document.querySelector('#profileButton').addEventListener('click', () => {
  toast.querySelector('strong').textContent = 'Hallo Alex! 👋'; toast.querySelector('p').textContent = 'Dein ausführliches Lernprofil kommt als Nächstes.';
  toast.classList.add('show'); clearTimeout(window.toastTimer); window.toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
});
