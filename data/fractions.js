/**
 * Curriculum data for fractions (Grades 5-8): quiz questions, grade metadata,
 * station descriptions, and lab challenges.
 */

import { shuffleArray } from '../src/core/math.js';

export const stationMeta = {
  pizza: {
    title: 'Pizza-Bäckerei',
    messages: {
      5: 'Willkommen in meiner Bäckerei! Belege genau so viele Stücke, wie bestellt wurden.',
      6: 'Klasse 6: Bestellt wird ein gekürzter Bruch – rechne auf deine Stückzahl um!',
      7: 'Klasse 7: Kombiniere zwei Bruchteile zu einer gemeinsamen Bestellung!',
      8: 'Klasse 8: Rechne Prozent-Bestellungen geschickt in Pizzastücke um!'
    }
  },
  lab: {
    title: 'Schoko-Labor',
    messages: {
      5: 'Zieh an den Reglern. Schokolade, Bruch und Zahlenstrahl verändern sich gemeinsam!',
      6: 'Finde gleichwertige Brüche mit verschiedenen Nennern im Schoko-Labor!',
      7: 'Beobachte genau, wie Bruch und Dezimalzahl auf dem Zahlenstrahl zusammenhängen.',
      8: 'Verknüpfe Bruch, Dezimalzahl und Prozentwert direkt an der Tafel!'
    }
  },
  duel: {
    title: 'Bruch-Duell',
    messages: {
      5: 'Vergleiche die Anteile, nicht nur die Zahlen. Die Waage zeigt dir danach den Beweis!',
      6: 'Mach die Brüche im Kopf gleichnamig und lass die Waage entscheiden.',
      7: 'Achte bei negativen Brüchen auf die Zahlengerade: Weiter rechts ist größer!',
      8: 'Vergleiche Brüche, Dezimalzahlen und Prozente miteinander!'
    }
  },
  quest: {
    title: 'Quiz-Quest',
    messages: {
      5: 'Zehn Missionen warten auf dich. Fehler sind nur Trainingspunkte fürs Gehirn!',
      6: 'Zehn Missionen rund um Kürzen, Erweitern, Addieren und Subtrahieren.',
      7: 'Zehn Missionen mit Multiplikation, Division und Vorzeichen.',
      8: 'Zehn Missionen mit Bruchtermen, Prozenten und Gleichungen!'
    }
  }
};

export const gradeContent = {
  5: {
    level: 'GRUNDLAGEN',
    title: 'Brüche verstehen',
    description: 'Teile erkennen, darstellen und einfache Brüche vergleichen.',
    lessons: '10 Missionen · 4 Stationen',
    quest: 'Zeig, wie sicher du Bruchteile schon erkennst.',
    intro: 'Zähle zuerst alle Teile und dann die markierten. Ganz ruhig – du packst das!'
  },
  6: {
    level: 'RECHNEN',
    title: 'Mit Brüchen rechnen',
    description: 'Kürzen, erweitern, addieren und subtrahieren.',
    lessons: '10 Missionen · 4 Stationen',
    quest: 'Rechne dich durch Kürzen, Erweitern, Plus und Minus.',
    intro: 'Suche den größten gemeinsamen Teiler. Damit wird der Bruch sofort übersichtlicher!'
  },
  7: {
    level: 'FORTGESCHRITTEN',
    title: 'Brüche & Vorzeichen',
    description: 'Multiplizieren, dividieren und negative Brüche meistern.',
    lessons: '10 Missionen · 4 Stationen',
    quest: 'Stelle dich Produkten, Quotienten und negativen Brüchen.',
    intro: 'Die Regel kennst du: Zähler mal Zähler, Nenner mal Nenner. Danach clever kürzen!'
  },
  8: {
    level: 'BRUCHTERME',
    title: 'Bruchterme & Gleichungen',
    description: 'Bruchterme vereinfachen, Prozente umrechnen und Gleichungen lösen.',
    lessons: '10 Missionen · 4 Stationen',
    quest: 'Knacke Bruchterme, Prozente und Gleichungen.',
    intro: 'Behandle den Bruch wie eine Gleichung: dieselbe Operation auf beiden Seiten. Los geht’s!'
  }
};

export const questionsByGrade = {
  5: [
    {
      type: 'AUFWÄRMEN',
      topic: 'Bruchteile erkennen',
      title: 'Welcher Bruch ist gefärbt?',
      hint: 'Zähle erst alle Teile – und dann die lila Teile.',
      visual: 'tiles',
      total: 8,
      filled: 3,
      cols: 4,
      answers: ['3/8', '5/8', '3/5'],
      correct: 0,
      tip: 'Oben steht die Zahl der gefärbten Teile, unten die Zahl aller Teile.'
    },
    {
      type: 'SCHNELL-CHECK',
      topic: 'Brüche vergleichen',
      title: 'Welcher Bruch ist größer?',
      hint: 'Stell dir zwei gleich große Pizzen vor.',
      visual: 'compare',
      fractions: ['2/3', '2/5'],
      answers: ['2/3', 'Gleich groß', '2/5'],
      correct: 0,
      tip: 'Bei gleichem Zähler gilt: Je kleiner der Nenner, desto größer die Stücke.'
    },
    {
      type: 'KÜRZEN',
      topic: 'Kürzen & Erweitern',
      title: 'Kürze den Bruch 6/8',
      hint: 'Teile Zähler und Nenner durch dieselbe Zahl.',
      visual: 'number',
      fraction: '6/8',
      answers: ['2/3', '3/4', '4/6'],
      correct: 1,
      tip: '6 und 8 lassen sich beide durch 2 teilen.'
    },
    {
      type: 'BILD-CHECK',
      topic: 'Bruchteile erkennen',
      title: 'Welcher Bruch ist gefärbt?',
      hint: 'Achte auf die Anzahl aller gleich großen Felder.',
      visual: 'tiles',
      total: 6,
      filled: 4,
      cols: 3,
      answers: ['4/6', '2/6', '4/2'],
      correct: 0,
      tip: 'Vier von insgesamt sechs Feldern sind lila.'
    },
    {
      type: 'GLEICHWERTIG',
      topic: 'Kürzen & Erweitern',
      title: 'Was ist gleich viel wie 1/2?',
      hint: 'Erweitern verändert den Wert eines Bruchs nicht.',
      visual: 'compareEqual',
      fractions: ['1/2', '?'],
      answers: ['2/3', '2/4', '3/5'],
      correct: 1,
      tip: 'Multipliziere Zähler und Nenner mit derselben Zahl.'
    },
    {
      type: 'BILD-CHECK',
      topic: 'Bruchteile erkennen',
      title: 'Welcher Bruch ist gefärbt?',
      hint: 'Zähle alle zehn Felder sorgfältig.',
      visual: 'tiles',
      total: 10,
      filled: 7,
      cols: 5,
      answers: ['7/10', '3/10', '7/3'],
      correct: 0,
      tip: 'Sieben von zehn Feldern sind gefärbt: 7/10.'
    },
    {
      type: 'VERGLEICHEN',
      topic: 'Brüche vergleichen',
      title: 'Welcher Bruch ist am kleinsten?',
      hint: 'Alle drei Brüche sind Teile desselben Ganzen.',
      visual: 'expression',
      equation: '1/4  ·  1/2  ·  3/4',
      answers: ['1/4', '1/2', '3/4'],
      correct: 0,
      tip: 'Ein Viertel ist kleiner als eine Hälfte und drei Viertel.'
    },
    {
      type: 'UMWANDELN',
      topic: 'Umwandeln',
      title: 'Wandle die gemischte Zahl um',
      hint: 'Ein Ganzes sind zwei Halbe.',
      visual: 'expression',
      equation: '1 1/2 = ?',
      answers: ['2/2', '3/2', '3/1'],
      correct: 1,
      tip: '1 Ganzes sind 2/2. Plus 1/2 ergibt 3/2.'
    },
    {
      type: 'ANTEIL BERECHNEN',
      topic: 'Anteile berechnen',
      title: 'Was sind 3/4 von 12?',
      hint: 'Teile 12 zuerst in vier gleich große Gruppen.',
      visual: 'expression',
      equation: '3/4 von 12',
      answers: ['3', '8', '9'],
      correct: 2,
      tip: '12 : 4 = 3 und 3 · 3 = 9.'
    },
    {
      type: 'FINALE',
      topic: 'Anteile berechnen',
      title: 'Sechs von acht Stücken sind weg',
      hint: 'Welcher Anteil des Kuchens wurde gegessen?',
      visual: 'expression',
      equation: '6 von 8 Stücken',
      answers: ['1/4', '3/4', '6/2'],
      correct: 1,
      tip: '6/8 lässt sich durch 2 kürzen und ergibt 3/4.'
    }
  ],
  6: [
    {
      type: 'KÜRZEN',
      topic: 'Kürzen & Erweitern',
      title: 'Kürze vollständig',
      hint: 'Finde eine Zahl, die Zähler und Nenner teilt.',
      visual: 'number',
      fraction: '18/24',
      answers: ['3/4', '6/8', '9/12'],
      correct: 0,
      tip: 'Teile 18 und 24 durch 6. So erhältst du 3/4.'
    },
    {
      type: 'ERWEITERN',
      topic: 'Kürzen & Erweitern',
      title: 'Erweitere auf den Nenner 20',
      hint: 'Mit welcher Zahl wird 5 zu 20?',
      visual: 'expression',
      equation: '3/5 = ?/20',
      answers: ['9/20', '12/20', '15/20'],
      acceptedInputs: ['12', '12/20'],
      correct: 1,
      tip: '5 · 4 = 20, also rechnest du auch 3 · 4 = 12.'
    },
    {
      type: 'ADDIEREN',
      topic: 'Addieren & Subtrahieren',
      title: 'Addiere gleichnamige Brüche',
      hint: 'Der Nenner bleibt gleich.',
      visual: 'expression',
      equation: '1/4 + 2/4',
      answers: ['3/8', '3/4', '2/4'],
      correct: 1,
      tip: 'Addiere die Zähler 1 + 2. Der gemeinsame Nenner 4 bleibt.'
    },
    {
      type: 'ADDIEREN',
      topic: 'Addieren & Subtrahieren',
      title: 'Mache die Brüche zuerst gleichnamig',
      hint: '2/3 passt auch zum Nenner 6.',
      visual: 'expression',
      equation: '2/3 + 1/6',
      answers: ['3/9', '5/6', '3/6'],
      correct: 1,
      tip: '2/3 sind 4/6. Zusammen mit 1/6 ergibt das 5/6.'
    },
    {
      type: 'SUBTRAHIEREN',
      topic: 'Addieren & Subtrahieren',
      title: 'Subtrahiere und kürze',
      hint: 'Ziehe erst die Zähler voneinander ab.',
      visual: 'expression',
      equation: '7/8 − 3/8',
      answers: ['1/2', '4/5', '3/8'],
      correct: 0,
      tip: '7/8 − 3/8 = 4/8. Vollständig gekürzt ist das 1/2.'
    },
    {
      type: 'ADDIEREN',
      topic: 'Addieren & Subtrahieren',
      title: 'Addiere gleichnamige Brüche',
      hint: 'Die Nenner bleiben unverändert.',
      visual: 'expression',
      equation: '3/7 + 2/7',
      answers: ['5/14', '5/7', '1/7'],
      correct: 1,
      tip: '3 + 2 = 5. Der gemeinsame Nenner bleibt 7.'
    },
    {
      type: 'SUBTRAHIEREN',
      topic: 'Addieren & Subtrahieren',
      title: 'Mache zuerst gleichnamig',
      hint: 'Wandle 1/3 in Sechstel um.',
      visual: 'expression',
      equation: '5/6 − 1/3',
      answers: ['4/3', '1/2', '4/6'],
      correct: 1,
      tip: '1/3 = 2/6. 5/6 − 2/6 = 3/6 = 1/2.'
    },
    {
      type: 'UMWANDELN',
      topic: 'Umwandeln',
      title: 'Mache daraus einen unechten Bruch',
      hint: 'Zwei Ganze sind acht Viertel.',
      visual: 'expression',
      equation: '2 1/4 = ?',
      answers: ['3/4', '8/4', '9/4'],
      correct: 2,
      tip: '2 Ganze sind 8/4. Plus 1/4 ergibt 9/4.'
    },
    {
      type: 'ANTEIL BERECHNEN',
      topic: 'Anteile berechnen',
      title: 'Was sind 3/5 von 20?',
      hint: 'Teile 20 zuerst durch 5.',
      visual: 'expression',
      equation: '3/5 von 20',
      answers: ['12', '15', '4'],
      correct: 0,
      tip: '20 : 5 = 4 und 4 · 3 = 12.'
    },
    {
      type: 'FINALE',
      topic: 'Umwandeln',
      title: 'Welcher Bruch ist 0,75?',
      hint: '75 Hundertstel lassen sich kürzen.',
      visual: 'expression',
      equation: '0,75 = ?',
      answers: ['3/4', '7/5', '1/4'],
      correct: 0,
      tip: '0,75 = 75/100. Gekürzt durch 25 ergibt das 3/4.'
    }
  ],
  7: [
    {
      type: 'MULTIPLIZIEREN',
      topic: 'Multiplizieren & Dividieren',
      title: 'Multipliziere die Brüche',
      hint: 'Zähler mal Zähler, Nenner mal Nenner – danach kürzen.',
      visual: 'expression',
      equation: '2/3 · 3/4',
      answers: ['1/2', '6/7', '2/4'],
      correct: 0,
      tip: '6/12 lässt sich vollständig zu 1/2 kürzen.'
    },
    {
      type: 'DIVIDIEREN',
      topic: 'Multiplizieren & Dividieren',
      title: 'Teile durch einen Bruch',
      hint: 'Multipliziere mit dem Kehrwert des zweiten Bruchs.',
      visual: 'expression',
      equation: '5/6 : 10/9',
      answers: ['3/4', '4/3', '1/2'],
      correct: 0,
      tip: '5/6 · 9/10 = 45/60 = 3/4.'
    },
    {
      type: 'NEGATIVE BRÜCHE',
      topic: 'Negative Brüche',
      title: 'Welcher Wert ist größer?',
      hint: 'Auf der Zahlengeraden ist weiter rechts immer größer.',
      visual: 'compare',
      fractions: ['−2/3', '−3/4'],
      answers: ['−2/3', 'Gleich groß', '−3/4'],
      correct: 0,
      tip: '−2/3 liegt näher an null als −3/4 und ist deshalb größer.'
    },
    {
      type: 'ADDIEREN',
      topic: 'Negative Brüche',
      title: 'Rechne mit Vorzeichen',
      hint: 'Die Nenner sind schon gleich.',
      visual: 'expression',
      equation: '−3/5 + 1/5',
      answers: ['−4/5', '−2/5', '2/5'],
      correct: 1,
      tip: '−3 + 1 = −2. Der Nenner bleibt 5.'
    },
    {
      type: 'GEMISCHTE ZAHL',
      topic: 'Multiplizieren & Dividieren',
      title: 'Rechne mit einer gemischten Zahl',
      hint: 'Wandle 1 1/2 zuerst in 3/2 um.',
      visual: 'expression',
      equation: '1 1/2 · 2/3',
      answers: ['1', '3/5', '2'],
      correct: 0,
      tip: '3/2 · 2/3 = 6/6 = 1.'
    },
    {
      type: 'MULTIPLIZIEREN',
      topic: 'Multiplizieren & Dividieren',
      title: 'Kürze geschickt vor dem Rechnen',
      hint: '15 und 5 sowie 4 und 8 lassen sich kürzen.',
      visual: 'expression',
      equation: '4/5 · 15/8',
      answers: ['3/2', '60/13', '2/3'],
      correct: 0,
      tip: '4/8 = 1/2 und 15/5 = 3. Übrig bleibt 3/2.'
    },
    {
      type: 'DIVIDIEREN',
      topic: 'Multiplizieren & Dividieren',
      title: 'Multipliziere mit dem Kehrwert',
      hint: 'Der Kehrwert von 1/2 ist 2/1.',
      visual: 'expression',
      equation: '3/4 : 1/2',
      answers: ['3/8', '3/2', '2/3'],
      correct: 1,
      tip: '3/4 · 2/1 = 6/4 = 3/2.'
    },
    {
      type: 'VORZEICHEN',
      topic: 'Negative Brüche',
      title: 'Subtrahiere einen positiven Bruch',
      hint: 'Mache aus 1/2 zuerst 2/4.',
      visual: 'expression',
      equation: '−1/2 − 1/4',
      answers: ['−1/4', '−3/4', '3/4'],
      correct: 1,
      tip: '−2/4 − 1/4 = −3/4.'
    },
    {
      type: 'KEHRWERT',
      topic: 'Multiplizieren & Dividieren',
      title: 'Wie lautet der Kehrwert?',
      hint: 'Vertausche Zähler und Nenner.',
      visual: 'number',
      fraction: '7/9',
      answers: ['9/7', '−7/9', '2/16'],
      correct: 0,
      tip: 'Beim Kehrwert von 7/9 werden Zähler und Nenner vertauscht: 9/7.'
    },
    {
      type: 'FINALE',
      topic: 'Anteile berechnen',
      title: 'Berechne den Anteil',
      hint: 'Teile 48 durch 8 und nimm davon fünf Teile.',
      visual: 'expression',
      equation: '5/8 von 48',
      answers: ['30', '35', '28'],
      correct: 0,
      tip: '48 : 8 = 6 und 6 · 5 = 30.'
    }
  ],
  8: [
    {
      type: 'GLEICHUNG',
      topic: 'Gleichungen',
      title: 'Bestimme x',
      hint: 'Multipliziere beide Seiten mit 4.',
      visual: 'expression',
      equation: 'x/4 = 3/5',
      answers: ['12/5', '3/20', '7/5'],
      correct: 0,
      tip: 'x = 4 · 3/5 = 12/5.'
    },
    {
      type: 'KLAMMER',
      topic: 'Bruchterme',
      title: 'Beachte die Reihenfolge',
      hint: 'Rechne zuerst in der Klammer.',
      visual: 'expression',
      equation: '(3/4 + 1/2) · 2',
      answers: ['5/2', '7/4', '2'],
      correct: 0,
      tip: '1/2 = 2/4. In der Klammer stehen 5/4, mal 2 ergibt 5/2.'
    },
    {
      type: 'BRUCHTERM',
      topic: 'Bruchterme',
      title: 'Kürze den Term',
      hint: '6 und 9 haben einen gemeinsamen Teiler.',
      visual: 'expression',
      equation: '6x/9',
      answers: ['2x/3', '3x/2', '2x/9'],
      correct: 0,
      tip: 'Teile Zähler und Nenner durch 3: 6x/9 = 2x/3.'
    },
    {
      type: 'PROZENT-CHECK',
      topic: 'Prozentrechnung',
      title: 'Wie viel Prozent sind 7/8?',
      hint: 'Berechne 7 : 8 und multipliziere mit 100.',
      visual: 'number',
      fraction: '7/8',
      answers: ['78 %', '87,5 %', '80 %'],
      correct: 1,
      tip: '7 : 8 = 0,875. Das sind 87,5 %.'
    },
    {
      type: 'GLEICHUNG',
      topic: 'Gleichungen',
      title: 'Löse die Bruchgleichung',
      hint: 'Multipliziere beide Seiten zuerst mit 6.',
      visual: 'expression',
      equation: 'x/3 + 1/6 = 5/6',
      answers: ['2', '4/3', '5/3'],
      correct: 0,
      tip: '2x + 1 = 5, also 2x = 4 und x = 2.'
    },
    {
      type: 'GLEICHUNG',
      topic: 'Gleichungen',
      title: 'Befreie den Term vom Nenner',
      hint: 'Multipliziere beide Seiten mit 3.',
      visual: 'expression',
      equation: '(x − 1)/3 = 2',
      answers: ['5', '7', '3'],
      correct: 1,
      tip: 'x − 1 = 6. Addiere 1 und du erhältst x = 7.'
    },
    {
      type: 'GLEICHUNG',
      topic: 'Gleichungen',
      title: 'Bestimme den Nenner x',
      hint: 'Kreuzmultiplizieren hilft.',
      visual: 'expression',
      equation: '2/x = 1/4',
      answers: ['6', '8', '2'],
      correct: 1,
      tip: '2 · 4 = x · 1, also ist x = 8.'
    },
    {
      type: 'BRUCHTERM',
      topic: 'Bruchterme',
      title: 'Vereinfache für x ≠ 0',
      hint: 'Ein Faktor x steht oben und unten.',
      visual: 'expression',
      equation: '3x²/6x',
      answers: ['x/2', 'x/3', '3x/6'],
      correct: 0,
      tip: 'Kürze x und teile 3 durch 6. Übrig bleibt x/2.'
    },
    {
      type: 'SACHRECHNEN',
      topic: 'Gleichungen',
      title: 'Finde die ganze Zahl',
      hint: 'Drei Viertel einer Zahl ergeben 24.',
      visual: 'expression',
      equation: '3/4 · x = 24',
      answers: ['18', '32', '36'],
      correct: 1,
      tip: '24 : 3 · 4 = 32.'
    },
    {
      type: 'FINALE',
      topic: 'Prozentrechnung',
      title: 'Wandle in Prozent um',
      hint: 'Berechne 3 : 8 und multipliziere mit 100.',
      visual: 'number',
      fraction: '3/8',
      answers: ['37,5 %', '38 %', '62,5 %'],
      correct: 0,
      tip: '3 : 8 = 0,375. Das entspricht 37,5 %.'
    }
  ]
};

/**
 * Returns a copy of a question with shuffled answer options and updated correct index.
 */
export function prepareQuestionWithShuffledAnswers(question, rng = Math.random) {
  const indexed = question.answers.map((text, index) => ({
    text,
    isCorrect: index === question.correct
  }));
  const shuffled = shuffleArray(indexed, rng);
  return {
    ...question,
    answers: shuffled.map(item => item.text),
    correct: shuffled.findIndex(item => item.isCorrect)
  };
}

/**
 * Builds a randomized 10-question quiz session for a grade:
 * keeps warm-up first and finale last, shuffles middle questions and all answer choices.
 */
export function buildQuizSession(grade, rng = Math.random) {
  const raw = questionsByGrade[grade] || questionsByGrade[5];
  if (raw.length <= 2) {
    return raw.map(question => prepareQuestionWithShuffledAnswers(question, rng));
  }
  const first = raw[0];
  const last = raw[raw.length - 1];
  const middle = shuffleArray(raw.slice(1, -1), rng);
  return [first, ...middle, last].map(question => prepareQuestionWithShuffledAnswers(question, rng));
}

export const labChallengesByGrade = {
  5: [
    {
      id: '5-half',
      prompt: 'Finde einen Bruch für genau die Hälfte (1/2) mit 6 oder 8 Teilen!',
      successTip: 'Genau! Ob 3/6 oder 4/8 – die Hälfte der Schokolade bleibt gleich groß.',
      check: (num, den) => num * 2 === den && (den === 6 || den === 8)
    },
    {
      id: '5-three-quarters',
      prompt: 'Stelle genau 3/4 der Schokoladentafel ein.',
      successTip: 'Super! Drei Viertel liegt genau bei 0,75 auf dem Zahlenstrahl.',
      check: (num, den) => num * 4 === den * 3
    },
    {
      id: '5-whole',
      prompt: 'Mach die Tafel komplett voll: Stelle genau 1 Ganzes ein!',
      successTip: 'Stark! Wenn Zähler und Nenner gleich sind, hast du 1 Ganzes (= 100 %).',
      check: (num, den) => num === den && den > 0
    }
  ],
  6: [
    {
      id: '6-twelfths',
      prompt: 'Erweitere 2/3 auf den Nenner 12 und stelle ihn ein!',
      successTip: 'Klasse erweitert! 2/3 · 4/4 ergibt 8/12.',
      check: (num, den) => den === 12 && num === 8
    },
    {
      id: '6-equiv-quarter',
      prompt: 'Stelle einen Bruch gleichwertig zu 1/4 mit 8 oder 12 Teilen ein!',
      successTip: 'Perfekt! 2/8 und 3/12 haben denselben Wert wie 1/4.',
      check: (num, den) => num * 4 === den && (den === 8 || den === 12)
    },
    {
      id: '6-five-sixths',
      prompt: 'Stelle einen Bruch dar, der genauso groß ist wie 5/6!',
      successTip: 'Richtig! 5/6 oder erweitert 10/12 treffen denselben Punkt auf dem Zahlenstrahl.',
      check: (num, den) => num * 6 === den * 5
    }
  ],
  7: [
    {
      id: '7-dec-375',
      prompt: 'Triff die Dezimalzahl 0,375 auf dem Zahlenstrahl!',
      successTip: 'Volltreffer! 3/8 = 3 : 8 = 0,375.',
      check: (num, den) => num * 8 === den * 3
    },
    {
      id: '7-dec-6',
      prompt: 'Stelle genau die Dezimalzahl 0,6 ein (Fünftel oder Zehntel!).',
      successTip: 'Stark! 3/5 = 6/10 = 0,6.',
      check: (num, den) => num * 5 === den * 3
    },
    {
      id: '7-dec-25',
      prompt: 'Stelle 0,25 mit mindestens 8 Teilen dar!',
      successTip: 'Super! 2/8 und 3/12 sind beide genau 0,25.',
      check: (num, den) => num * 4 === den && den >= 8
    }
  ],
  8: [
    {
      id: '8-pct-75',
      prompt: 'Stelle genau 75 % ein – aber wähle einen Nenner größer als 4!',
      successTip: 'Profi! 6/8 und 9/12 entsprechen beide 75 %.',
      check: (num, den) => num * 4 === den * 3 && den > 4
    },
    {
      id: '8-pct-375',
      prompt: 'Triff genau 37,5 % der Schokoladentafel!',
      successTip: 'Perfekt! 3/8 = 0,375 = 37,5 %.',
      check: (num, den) => num * 8 === den * 3
    },
    {
      id: '8-pct-60',
      prompt: 'Stelle genau 60 % ein!',
      successTip: 'Genau richtig! 3/5 oder 6/10 sind 60 %.',
      check: (num, den) => num * 5 === den * 3
    }
  ]
};
