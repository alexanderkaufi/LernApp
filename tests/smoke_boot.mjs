/**
 * Interactive DOM/Browser mock test covering full app boot, all 4 subjects,
 * interactive labs, quiz flows, retry round, backup export, and profile reset.
 */

const elCache = new Map();
const storageMap = new Map();

function makeElement(seed = '') {
  const classes = new Set();
  const attrs = {};
  const listeners = {};
  const defaultValues = {
    '#gradeSelect': '5',
    '#labDenominator': '8',
    '#labNumerator': '3',
    '#geoAngleSlider': '90',
    '#geoWidthSlider': '6',
    '#geoHeightSlider': '4',
    '#sciencePowerSlider': '120',
    '#scienceEffSlider': '20',
    '#newProfileNameInput': 'Jonas',
    '#dictationInput': 'Fahrrad'
  };
  const el = {
    textContent: '',
    innerHTML: '',
    value: defaultValues[seed] || 'Mia',
    max: '12',
    hidden: false,
    disabled: false,
    dataset: {
      filter: 'mathe',
      station: 'pizza',
      stationTab: 'lab',
      denominator: '6',
      panel: 'pizza',
      subject: 'mathe',
      slice: '0',
      answer: '0',
      duel: 'left',
      openLab: 'geometry',
      startQuiz: 'geometry',
      geoMode: 'angle',
      geoShape: 'rect',
      scienceSystem: 'solar',
      wordIndex: '0',
      cheatFilter: 'fractions',
      insertChar: '/',
      sprintAnswer: '0',
      wordsMode: 'dictation',
      englishOption: 'are',
      profileId: 'p1'
    },
    style: { setProperty() {} },
    classList: {
      add: (...c) => c.forEach(x => classes.add(x)),
      remove: (...c) => c.forEach(x => classes.delete(x)),
      toggle: (c, force) =>
        force === undefined
          ? classes.has(c)
            ? classes.delete(c)
            : classes.add(c)
          : force
            ? classes.add(c)
            : classes.delete(c),
      contains: c => classes.has(c)
    },
    setAttribute: (k, v) => {
      attrs[k] = String(v);
    },
    getAttribute: k => attrs[k] ?? null,
    addEventListener(type, fn) {
      listeners[type] = listeners[type] || [];
      listeners[type].push(fn);
    },
    trigger(type, eventOverrides = {}) {
      const evt = {
        currentTarget: el,
        target: el,
        preventDefault() {},
        ...eventOverrides
      };
      (listeners[type] || []).forEach(fn => fn(evt));
    },
    querySelector: sel => getMockEl(`${seed} ${sel}`),
    querySelectorAll: sel => [getMockEl(`${seed} ${sel}[0]`), getMockEl(`${seed} ${sel}[1]`), getMockEl(`${seed} ${sel}[2]`)],
    scrollIntoView() {},
    showModal() {},
    close() {},
    click() {},
    remove() {},
    appendChild() {},
    cloneNode: () => makeElement('clone')
  };
  return el;
}

function getMockEl(sel) {
  if (!elCache.has(sel)) elCache.set(sel, makeElement(sel));
  return elCache.get(sel);
}

function resetEnvironment(protocol = 'http:') {
  elCache.clear();
  storageMap.clear();
  globalThis.localStorage = {
    getItem: k => storageMap.get(k) ?? null,
    setItem: (k, v) => storageMap.set(k, String(v)),
    removeItem: k => storageMap.delete(k)
  };
  globalThis.document = {
    querySelector: sel => getMockEl(sel),
    querySelectorAll: sel => [
      getMockEl(`${sel}[0]`),
      getMockEl(`${sel}[1]`),
      getMockEl(`${sel}[2]`)
    ],
    createElement: tag => makeElement(tag),
    body: makeElement('body'),
    addEventListener() {},
    activeElement: null
  };
  globalThis.window = {
    addEventListener() {},
    scrollTo() {},
    print() {}
  };
  globalThis.location = { hash: '', protocol };
  globalThis.history = {
    pushState(_s, _t, h) {
      globalThis.location.hash = h;
    }
  };
  globalThis.requestAnimationFrame = fn => fn();
  globalThis.setTimeout = () => 1;
  globalThis.clearTimeout = () => {};
}

function runInteractiveChecks(label) {
  // Test grade switch across 5..8
  for (const grade of ['6', '7', '8', '5']) {
    getMockEl('#gradeSelect').value = grade;
    getMockEl('#gradeSelect').trigger('change');
  }

  // Test Fraction stations
  getMockEl('#pizzaCheckButton').trigger('click');
  getMockEl('#pizzaNewButton').trigger('click');
  getMockEl('#labDenominator').value = '6';
  getMockEl('#labDenominator').trigger('input');
  getMockEl('#labNumerator').value = '3';
  getMockEl('#labNumerator').trigger('input');
  getMockEl('#labCheckChallengeButton').trigger('click');
  getMockEl('#labNextChallengeButton').trigger('click');
  getMockEl('#labCelebrateButton').trigger('click');
  getMockEl('[data-duel][0]').trigger('click');
  getMockEl('#newDuelButton').trigger('click');

  // Test Geometry, Words, Science labs
  getMockEl('[data-open-lab][0]').trigger('click');
  getMockEl('#geoAngleSlider').value = '90';
  getMockEl('#geoAngleSlider').trigger('input');
  getMockEl('#geoCheckChallengeButton').trigger('click');
  getMockEl('#geoNextChallengeButton').trigger('click');
  getMockEl('#geoQuizStartButton').trigger('click');

  getMockEl('#wordsCheckButton').trigger('click');
  getMockEl('#wordsNextButton').trigger('click');
  getMockEl('#dictationForm').trigger('submit');
  getMockEl('#dictationNextButton').trigger('click');
  getMockEl('#wordsQuizStartButton').trigger('click');

  getMockEl('[data-english-option][0]').trigger('click');
  getMockEl('#englishNextButton').trigger('click');
  getMockEl('#englishQuizStartButton').trigger('click');

  getMockEl('#sciencePowerSlider').value = '100';
  getMockEl('#sciencePowerSlider').trigger('input');
  getMockEl('#scienceCheckChallengeButton').trigger('click');
  getMockEl('#scienceNextChallengeButton').trigger('click');
  getMockEl('#scienceQuizStartButton').trigger('click');

  // Test Geometry 6-question quiz flow
  for (let i = 0; i < 6; i++) {
    getMockEl('#answers [data-answer][0]').trigger('click');
    getMockEl('#nextButton').trigger('click');
  }

  // Test Fractions 10-question quiz flow
  getMockEl('#questStartButton').trigger('click');
  getMockEl('#lessonMascot').trigger('click');
  for (let i = 0; i < 10; i++) {
    getMockEl('#answers [data-answer][0]').trigger('click');
    getMockEl('#nextButton').trigger('click');
  }

  // Verify XP, dailyXp, and streak were recorded
  const beforeReset = JSON.parse(storageMap.get('kluug-progress'));
  if (!beforeReset || beforeReset.totalXp <= 0 || beforeReset.dailyXp <= 0 || beforeReset.streakDays < 1) {
    throw new Error(`[${label}] Expected positive XP, dailyXp and streak, got ${JSON.stringify(beforeReset)}`);
  }

  // Trigger retry round if wrong answers occurred
  if (!getMockEl('#retryWrongButton').hidden) {
    getMockEl('#retryWrongButton').trigger('click');
  }

  // Test Profi-Eingabe toggle & Cheat-Sheets & Blitz-Sprint & Smart Tip
  getMockEl('#profiModeToggle').trigger('click');
  getMockEl('#freeAnswerInput').value = '3/8';
  getMockEl('#answers #freeInputForm').trigger('submit');
  getMockEl('#profiModeToggle').trigger('click');

  getMockEl('#cheatButton').trigger('click');
  getMockEl('[data-cheat-filter][1]').trigger('click');
  getMockEl('#cheatCloseButton').trigger('click');

  getMockEl('#openSprintButton').trigger('click');
  getMockEl('#sprintCalmToggle').checked = true;
  getMockEl('#sprintStartButton').trigger('click');
  getMockEl('#sprintAnswers [data-sprint-answer][0]').trigger('click');
  getMockEl('#sprintStopButton').trigger('click');

  getMockEl('#smartTipButton').trigger('click');

  // Test Profile name save + multi-profile add/delete + print + report + reset confirmation
  getMockEl('#profileButton').trigger('click');
  getMockEl('#profileReportButton').trigger('click');
  getMockEl('#profilePrintButton').trigger('click');
  getMockEl('#newProfileNameInput').value = 'Jonas';
  getMockEl('#newProfileForm').trigger('submit');
  getMockEl('#profileDeleteButton').trigger('click');
  getMockEl('#profileNameInput').value = 'Lena';
  getMockEl('#profileNameForm').trigger('submit');
  getMockEl('#profileResetButton').trigger('click');
  getMockEl('#profileResetButton').trigger('click');

  const savedVault = JSON.parse(storageMap.get('kluug-profiles-v1'));
  if (!savedVault || !savedVault.profiles[savedVault.activeProfileId]) {
    throw new Error(`[${label}] Expected multi-profile vault persisted`);
  }
  const saved = JSON.parse(storageMap.get('kluug-progress'));
  if (!saved || saved.totalXp !== 0 || saved.userName !== 'Lena') {
    throw new Error(`[${label}] Expected reset to keep profile name and zero XP`);
  }
}

function loadClassicBundle() {
  for (const candidate of ['LernApp/app.bundle.js', 'app.bundle.js', '../app.bundle.js']) {
    try {
      load(candidate);
      return candidate;
    } catch (_) {
      /* Try next relative path based on CWD. */
    }
  }
  throw new Error('Could not locate app.bundle.js from current working directory');
}

// 1. Test native ES module boot (http/https)
resetEnvironment('http:');
await import('../app.js');
runInteractiveChecks('es-modules');

// 2. Test offline classic bundle boot (file://)
resetEnvironment('file:');
const loadedBundle = loadClassicBundle();
runInteractiveChecks(`bundle:${loadedBundle}`);

print('INTERACTIVE SMOKE TEST PASSED (ES modules + file:// bundle)');
