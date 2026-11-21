/**
 * Curriculum data for English (Grades 5-8):
 * interactive listening/grammar studio tasks and 24 quiz questions.
 */

export const englishStudioTasksByGrade = {
  5: [
    {
      id: 'en-5-be',
      prompt: 'Wähle die richtige Form von »to be«!',
      sentence: 'My friends ___ very funny.',
      speakSentence: 'My friends are very funny.',
      options: ['are', 'is', 'am'],
      correct: 'are',
      tip: '»My friends« ist Mehrzahl (they) → deshalb heißt es »are«.'
    },
    {
      id: 'en-5-have',
      prompt: 'Ergänze »has« oder »have« richtig!',
      sentence: 'She ___ got a brand-new bike.',
      speakSentence: 'She has got a brand-new bike.',
      options: ['has', 'have', 'had'],
      correct: 'has',
      tip: 'Bei he, she, it steht im Präsens »has«.'
    },
    {
      id: 'en-5-vocab',
      prompt: 'Hör genau hin und wähle die Übersetzung für »library«!',
      sentence: 'I borrow books at the library.',
      speakSentence: 'I borrow books at the library.',
      options: ['Bücherei / Bibliothek', 'Buchhandlung', 'Schulhof'],
      correct: 'Bücherei / Bibliothek',
      tip: 'Achtung False Friend: »library« = Bücherei, »bookshop« = Buchhandlung!'
    }
  ],
  6: [
    {
      id: 'en-6-past-go',
      prompt: 'Setze das unregelmäßige Verb im Simple Past ein!',
      sentence: 'Yesterday we ___ to the park.',
      speakSentence: 'Yesterday we went to the park.',
      options: ['went', 'goed', 'gone'],
      correct: 'went',
      tip: '»go – went – gone«: Im Simple Past verwendest du »went«.'
    },
    {
      id: 'en-6-past-buy',
      prompt: 'Welche Simple-Past-Form passt zu »buy«?',
      sentence: 'Last Friday Tom ___ a cool comic.',
      speakSentence: 'Last Friday Tom bought a cool comic.',
      options: ['bought', 'buyed', 'brings'],
      correct: 'bought',
      tip: '»buy – bought – bought« gehört zu den unregelmäßigen Verben.'
    },
    {
      id: 'en-6-vocab',
      prompt: 'Hör zu: Was bedeutet »weather« im Satz?',
      sentence: 'The weather is sunny today.',
      speakSentence: 'The weather is sunny today.',
      options: ['Wetter', 'ob', 'Feder'],
      correct: 'Wetter',
      tip: '»weather« = Wetter (während »whether« = ob bedeutet).'
    }
  ],
  7: [
    {
      id: 'en-7-perf',
      prompt: 'Vervollständige das Present Perfect!',
      sentence: 'I have ___ my homework already.',
      speakSentence: 'I have finished my homework already.',
      options: ['finished', 'finish', 'finishing'],
      correct: 'finished',
      tip: 'Present Perfect = have/has + 3. Verbform (Past Participle).'
    },
    {
      id: 'en-7-since',
      prompt: 'Zeitpunkt (since) oder Zeitspanne (for)?',
      sentence: 'We have lived here ___ 2021.',
      speakSentence: 'We have lived here since 2021.',
      options: ['since', 'for', 'from'],
      correct: 'since',
      tip: '2021 ist ein fester Startzeitpunkt → deshalb »since«.'
    },
    {
      id: 'en-7-irreg',
      prompt: 'Wähle die 3. Verbform (Past Participle) von »write«!',
      sentence: 'She has ___ a long email.',
      speakSentence: 'She has written a long email.',
      options: ['written', 'wrote', 'writed'],
      correct: 'written',
      tip: '»write – wrote – written«.'
    }
  ],
  8: [
    {
      id: 'en-8-if2',
      prompt: 'If-Clause Type 2 (unwahrscheinliche Vorstellung):',
      sentence: 'If I ___ a bird, I would fly over the sea.',
      speakSentence: 'If I were a bird, I would fly over the sea.',
      options: ['were', 'am', 'would be'],
      correct: 'were',
      tip: 'Im If-Satz Typ 2 steht Simple Past (»were«), »would« gehört in den Hauptsatz.'
    },
    {
      id: 'en-8-passive',
      prompt: 'Ergänze das Passiv (Simple Present Passive)!',
      sentence: 'English is ___ in many countries.',
      speakSentence: 'English is spoken in many countries.',
      options: ['spoken', 'spoke', 'speaking'],
      correct: 'spoken',
      tip: 'Passiv = Form von »to be« + 3. Verbform (»speak – spoke – spoken«).'
    },
    {
      id: 'en-8-vocab',
      prompt: 'Hör zu: Was bedeutet »environment«?',
      sentence: 'We should protect our environment.',
      speakSentence: 'We should protect our environment.',
      options: ['Umwelt', 'Erfindung', 'Entwicklung'],
      correct: 'Umwelt',
      tip: '»environment« bedeutet Umwelt / Umgebung.'
    }
  ]
};

export const englishQuestionsByGrade = {
  5: [
    {
      type: 'TO BE',
      topic: 'Pronouns & to be',
      title: 'Welche Form von »to be« passt zu »I«?',
      hint: 'Denke an »I am, you are, he/she/it is«.',
      visual: 'englishCard',
      phrase: 'I ___ twelve years old.',
      speakText: 'I am twelve years old.',
      answers: ['am', 'is', 'are'],
      correct: 0,
      tip: 'Nach »I« steht immer »am«.'
    },
    {
      type: 'THERE IS / ARE',
      topic: 'Pronouns & to be',
      title: 'Einzahl oder Mehrzahl?',
      hint: 'Schau auf »three books«.',
      visual: 'englishCard',
      phrase: 'There ___ three books on the desk.',
      speakText: 'There are three books on the desk.',
      answers: ['are', 'is', 'has'],
      correct: 0,
      tip: 'Bei mehreren Dingen (Plural) nutzt man »There are«.'
    },
    {
      type: 'PLURAL',
      topic: 'Nouns & Plurals',
      title: 'Wie lautet der unregelmäßige Plural von »child«?',
      hint: 'Auf Englisch hängt man hier kein einfaches -s an.',
      visual: 'englishCard',
      phrase: 'one child → two ___',
      speakText: 'one child, two children',
      answers: ['children', 'childs', 'childrens'],
      correct: 0,
      tip: 'Der Plural von »child« heißt »children« (ohne -s!).'
    },
    {
      type: 'VERNEINUNG',
      topic: 'Simple Present',
      title: 'Wie verneint man im Simple Present bei »my sister«?',
      hint: 'He, she, it – das »s« muss mit!',
      visual: 'englishCard',
      phrase: 'My sister ___ like spiders.',
      speakText: 'My sister does not like spiders.',
      answers: ['doesn’t', 'don’t', 'isn’t'],
      correct: 0,
      tip: 'Bei der 3. Person Singular nutzt man »doesn’t« + Grundform.'
    },
    {
      type: 'VOKABELN',
      topic: 'Vocabulary',
      title: 'Was heißt »always« auf Deutsch?',
      hint: 'Das Häufigkeitsadverb steht für 100 % der Fälle.',
      visual: 'englishCard',
      phrase: 'I always brush my teeth.',
      speakText: 'I always brush my teeth.',
      answers: ['immer', 'oft', 'selten'],
      correct: 0,
      tip: '»always« = immer, »often« = oft, »never« = nie.'
    },
    {
      type: 'PRÄPOSITION',
      topic: 'Simple Present',
      title: 'Welche Präposition steht vor Wochentagen?',
      hint: 'Im Englischen sagt man bei Tagen nicht »in« oder »at«.',
      visual: 'englishCard',
      phrase: 'We have English ___ Monday.',
      speakText: 'We have English on Monday.',
      answers: ['on', 'at', 'in'],
      correct: 0,
      tip: 'Vor Wochentagen steht »on« (on Monday), vor Uhrzeiten »at« (at 8 o’clock).'
    }
  ],
  6: [
    {
      type: 'SIMPLE PAST',
      topic: 'Simple Past',
      title: 'Wie lautet das Simple Past von »see«?',
      hint: 'Ein unregelmäßiges Verb: see – ___ – seen.',
      visual: 'englishCard',
      phrase: 'Last week I ___ a dolphin.',
      speakText: 'Last week I saw a dolphin.',
      answers: ['saw', 'seed', 'seen'],
      correct: 0,
      tip: '»see – saw – seen«: Im Simple Past heißt es »saw«.'
    },
    {
      type: 'FRAGE',
      topic: 'Simple Past',
      title: 'Welches Hilfsverb beginnt eine Frage im Simple Past?',
      hint: 'Achte auf das Signalwort »yesterday«.',
      visual: 'englishCard',
      phrase: '___ you watch the match yesterday?',
      speakText: 'Did you watch the match yesterday?',
      answers: ['Did', 'Do', 'Were'],
      correct: 0,
      tip: 'Fragen im Simple Past mit Vollverb (watch) bildet man mit »Did«.'
    },
    {
      type: 'STEIGERUNG',
      topic: 'Adjectives',
      title: 'Wie heißt der Superlativ von »good«?',
      hint: 'good – better – the …',
      visual: 'englishCard',
      phrase: 'This is the ___ movie ever!',
      speakText: 'This is the best movie ever!',
      answers: ['best', 'goodest', 'most good'],
      correct: 0,
      tip: '»good« steigert man unregelmäßig: good – better – the best.'
    },
    {
      type: 'MENGEN',
      topic: 'Adjectives',
      title: '»much« oder »many« bei zählbaren Äpfeln?',
      hint: 'Kannst du 1, 2, 3 apples zählen?',
      visual: 'englishCard',
      phrase: 'How ___ apples do we need?',
      speakText: 'How many apples do we need?',
      answers: ['many', 'much', 'little'],
      correct: 0,
      tip: 'Bei zählbaren Pluralnomen steht »many«, bei unzählbaren (milk, water) »much«.'
    },
    {
      type: 'VOKABELN',
      topic: 'Vocabulary',
      title: 'Was bedeutet »to borrow«?',
      hint: 'Achte auf den Unterschied zu »to lend«.',
      visual: 'englishCard',
      phrase: 'Can I borrow your pen?',
      speakText: 'Can I borrow your pen?',
      answers: ['sich etwas ausleihen', 'jemandem etwas verleihen', 'etwas verstecken'],
      correct: 0,
      tip: '»borrow« = sich etwas ausleihen; »lend« = jemandem etwas verleihen.'
    },
    {
      type: 'SIMPLE PAST',
      topic: 'Simple Past',
      title: 'Setze die Vergangenheitsform von »take« ein!',
      hint: 'take – ___ – taken.',
      visual: 'englishCard',
      phrase: 'She ___ the early bus.',
      speakText: 'She took the early bus.',
      answers: ['took', 'taked', 'taken'],
      correct: 0,
      tip: '»take – took – taken«.'
    }
  ],
  7: [
    {
      type: 'PRESENT PERFECT',
      topic: 'Present Perfect',
      title: 'Welches Hilfsverb ergänzt das Present Perfect?',
      hint: '»I« braucht »have« oder »has«?',
      visual: 'englishCard',
      phrase: 'I ___ just arrived at home.',
      speakText: 'I have just arrived at home.',
      answers: ['have', 'has', 'did'],
      correct: 0,
      tip: 'Present Perfect mit »just« bildet man mit »have« + Past Participle.'
    },
    {
      type: 'SINCE / FOR',
      topic: 'Present Perfect',
      title: '»since« oder »for« bei »three hours«?',
      hint: 'Ist »three hours« ein Zeitraum (wie lange?) oder ein Zeitpunkt?',
      visual: 'englishCard',
      phrase: 'They have trained ___ three hours.',
      speakText: 'They have trained for three hours.',
      answers: ['for', 'since', 'ago'],
      correct: 0,
      tip: 'Für Zeitspannen (three hours, two days) steht »for«.'
    },
    {
      type: 'IF-CLAUSE 1',
      topic: 'If-Clauses & Modals',
      title: 'Vervollständige den If-Satz Typ 1 (real möglich)!',
      hint: 'If + Simple Present → Hauptsatz mit …',
      visual: 'englishCard',
      phrase: 'If it rains, we ___ stay inside.',
      speakText: 'If it rains, we will stay inside.',
      answers: ['will', 'would', 'did'],
      correct: 0,
      tip: 'Im If-Clause Typ 1 nutzt man »will + infinitive« im Hauptsatz.'
    },
    {
      type: 'GEGENTEIL',
      topic: 'Vocabulary',
      title: 'Welches Wort ist das Gegenteil von »polite« (höflich)?',
      hint: 'Wenn jemand unhöflich oder frech ist…',
      visual: 'englishCard',
      phrase: 'polite ↔ ___',
      speakText: 'polite, rude',
      answers: ['rude', 'kind', 'clever'],
      correct: 0,
      tip: '»polite« = höflich, das Gegenteil ist »rude« (unhöflich).'
    },
    {
      type: 'RELATIVSATZ',
      topic: 'If-Clauses & Modals',
      title: 'Welches Relativpronomen nutzt man für Personen?',
      hint: '»The girl« ist eine Person.',
      visual: 'englishCard',
      phrase: 'The girl ___ lives next door is nice.',
      speakText: 'The girl who lives next door is nice.',
      answers: ['who', 'which', 'what'],
      correct: 0,
      tip: 'Für Menschen verwendet man »who« (oder »that«), für Dinge »which«.'
    },
    {
      type: 'MODALVERBEN',
      topic: 'If-Clauses & Modals',
      title: 'Wie drückt man »können« in der Zukunft (will-future) aus?',
      hint: 'Nach »will« kann »can« nicht direkt stehen – man nutzt eine Ersatzform.',
      visual: 'englishCard',
      phrase: 'Tomorrow I ___ able to help you.',
      speakText: 'Tomorrow I will be able to help you.',
      answers: ['will be', 'can', 'must'],
      correct: 0,
      tip: 'Die Ersatzform für »can« im Futur heißt »will be able to«.'
    }
  ],
  8: [
    {
      type: 'IF-CLAUSE 2',
      topic: 'Conditionals & Passive',
      title: 'If-Clause Typ 2: Welches Hilfsverb gehört in den Hauptsatz?',
      hint: 'Im If-Satz steht Simple Past (studied).',
      visual: 'englishCard',
      phrase: 'If he studied more, he ___ pass easily.',
      speakText: 'If he studied more, he would pass easily.',
      answers: ['would', 'will', 'had'],
      correct: 0,
      tip: 'Typ 2 kombiniert If + Simple Past mit »would + infinitive«.'
    },
    {
      type: 'PASSIVE',
      topic: 'Conditionals & Passive',
      title: 'Simple Past Passive: Welche Form fehlt?',
      hint: '1995 liegt in der Vergangenheit, »the bridge« ist Einzahl.',
      visual: 'englishCard',
      phrase: 'The bridge ___ built in 1995.',
      speakText: 'The bridge was built in 1995.',
      answers: ['was', 'is', 'has'],
      correct: 0,
      tip: 'Simple Past Passive = was/were + Past Participle (built).'
    },
    {
      type: 'GERUND',
      topic: 'Conditionals & Passive',
      title: 'Welche Verbform steht nach der Präposition »at«?',
      hint: 'Nach Präpositionen (good at, interested in) steht das Gerund (-ing).',
      visual: 'englishCard',
      phrase: 'She is good at ___ stories.',
      speakText: 'She is good at writing stories.',
      answers: ['writing', 'write', 'wrote'],
      correct: 0,
      tip: 'Nach Präpositionen folgt immer die ing-Form (Gerund).'
    },
    {
      type: 'PHRASAL VERB',
      topic: 'Vocabulary',
      title: 'Was bedeutet »to look after someone«?',
      hint: 'Babysitter machen das oft mit kleinen Kindern.',
      visual: 'englishCard',
      phrase: 'I look after my little brother.',
      speakText: 'I look after my little brother.',
      answers: ['auf jemanden aufpassen', 'jemandem hinterherschauen', 'im Buch nachschlagen'],
      correct: 0,
      tip: '»look after« = sich kümmern um / aufpassen; »look up« = nachschlagen.'
    },
    {
      type: 'PAST PERFECT',
      topic: 'Conditionals & Passive',
      title: 'Vorvergangenheit: Welches Hilfsverb bildet das Past Perfect?',
      hint: 'Der Zug war schon abgefahren, bevor wir ankamen.',
      visual: 'englishCard',
      phrase: 'Before we arrived, the train ___ already left.',
      speakText: 'Before we arrived, the train had already left.',
      answers: ['had', 'has', 'was'],
      correct: 0,
      tip: 'Das Past Perfect wird immer mit »had« + 3. Verbform gebildet.'
    },
    {
      type: 'FALSE FRIEND',
      topic: 'Vocabulary',
      title: 'Vorsicht, False Friend! Was heißt »become« auf Deutsch?',
      hint: 'Nicht »bekommen« (das wäre »get«)!',
      visual: 'englishCard',
      phrase: 'I want to become a pilot.',
      speakText: 'I want to become a pilot.',
      answers: ['werden', 'bekommen', 'bleiben'],
      correct: 0,
      tip: '»become« bedeutet »werden«; »bekommen« heißt auf Englisch »get / receive«.'
    }
  ]
};
