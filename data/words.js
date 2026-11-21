/**
 * Curriculum data for German / Language (Grades 5-8):
 * interactive sentence scanner tasks and grade-specific grammar/orthography quizzes.
 */

export const wordScannerTasksByGrade = {
  5: [
    {
      id: 'w-5-nomen',
      prompt: 'Klicke alle Nomen im Satz an!',
      words: ['Der', 'flinke', 'Fuchs', 'springt', 'über', 'den', 'hohen', 'Zaun'],
      targets: [2, 7],
      tip: 'Nomen bezeichnen Lebewesen, Dinge oder Begriffe und werden großgeschrieben (Fuchs, Zaun).'
    },
    {
      id: 'w-5-adjektiv',
      prompt: 'Finde das Adjektiv (Wie-Wort) im Satz!',
      words: ['Heute', 'liest', 'Mia', 'ein', 'spannendes', 'Buch', 'im', 'Garten'],
      targets: [4],
      tip: '»spannendes« beschreibt, wie das Buch ist. »Heute« hingegen ist ein Adverb.'
    },
    {
      id: 'w-5-verb',
      prompt: 'Klicke beide Verben (Tun-Wörter) an!',
      words: ['Zwei', 'Freunde', 'lachen', 'laut', 'und', 'rennen', 'los'],
      targets: [2, 5],
      tip: '»lachen« und »rennen« sagen aus, was die Freunde tun.'
    }
  ],
  6: [
    {
      id: 'w-6-prep',
      prompt: 'Finde die Präposition (Verhältniswort)!',
      words: ['Der', 'kleine', 'Hund', 'wartet', 'geduldig', 'vor', 'der', 'Tür'],
      targets: [5],
      tip: '»vor« gibt an, wo sich der Hund befindet – eine klassische Präposition.'
    },
    {
      id: 'w-6-pronomen',
      prompt: 'Markiere beide Personalpronomen (Fürwörter)!',
      words: ['Wir', 'schenken', 'ihr', 'heute', 'einen', 'bunten', 'Ball'],
      targets: [0, 2],
      tip: '»Wir« und »ihr« stehen stellvertretend für Personen.'
    },
    {
      id: 'w-6-steigerung',
      prompt: 'Klicke beide gesteigerten Adjektive an (Komparativ & Superlativ)!',
      words: ['Mein', 'Bruder', 'läuft', 'schneller', 'als', 'der', 'schnellste', 'Wind'],
      targets: [3, 6],
      tip: '»schneller« (Komparativ) und »schnellste« (Superlativ) sind Steigerungsformen von »schnell«.'
    }
  ],
  7: [
    {
      id: 'w-7-konj',
      prompt: 'Finde die unterordnende Konjunktion (Bindewort)!',
      words: ['Wir', 'bleiben', 'drinnen,', 'weil', 'es', 'draußen', 'regnet'],
      targets: [3],
      tip: '»weil« leitet den Nebensatz ein und nennt den Grund.'
    },
    {
      id: 'w-7-passiv',
      prompt: 'Markiere beide Teile des Vorgangspassivs!',
      words: ['Das', 'alte', 'Fahrrad', 'wird', 'morgen', 'sorgfältig', 'repariert'],
      targets: [3, 6],
      tip: 'Das Vorgangspassiv wird mit »werden« + Partizip II gebildet: »wird ... repariert«.'
    },
    {
      id: 'w-7-adverb',
      prompt: 'Finde beide Adverbien (Zeit & Ort) im Satz!',
      words: ['Gestern', 'fand', 'Tom', 'dort', 'einen', 'goldenen', 'Schlüssel'],
      targets: [0, 3],
      tip: '»Gestern« (Zeit) und »dort« (Ort) sind unveränderliche Adverbien.'
    }
  ],
  8: [
    {
      id: 'w-8-praedikat',
      prompt: 'Markiere das Prädikat (die gebeugte Verbform)!',
      words: ['Die', 'kluge', 'Forscherin', 'löst', 'das', 'schwierige', 'Rätsel'],
      targets: [3],
      tip: '»löst« ist die finite Verbform und bildet das Prädikat des Satzes.'
    },
    {
      id: 'w-8-relativ',
      prompt: 'Klicke das Relativpronomen an (nicht den Artikel)!',
      words: ['Das', 'Buch,', 'das', 'auf', 'dem', 'Tisch', 'liegt,', 'gehört', 'mir'],
      targets: [2],
      tip: 'Das zweite »das« leitet den Relativsatz ein und verweist auf »Das Buch«.'
    },
    {
      id: 'w-8-genitiv',
      prompt: 'Finde die Genitiv-Präposition am Satzanfang!',
      words: ['Trotz', 'des', 'Regens', 'wanderten', 'alle', 'tapfer', 'weiter'],
      targets: [0],
      tip: '»Trotz« verlangt den Genitiv (Wessen? Trotz des Regens).'
    }
  ]
};

export const wordsDictationByGrade = {
  5: [
    {
      id: 'dict-5-fahrrad',
      sentence: 'Mein neues Fahrrad steht sicher im Hof.',
      masked: 'Mein neues ___ steht sicher im Hof.',
      target: 'Fahrrad',
      clue: 'Nomen mit Doppel-r und großem Anfangsbuchstaben!'
    },
    {
      id: 'dict-5-wald',
      sentence: 'Im Herbst raschelt das bunte Laub im Wald.',
      masked: 'Im Herbst raschelt das bunte Laub im ___.',
      target: 'Wald',
      clue: 'Verlängere das Wort (Wälder) – dann hörst du d oder t!'
    }
  ],
  6: [
    {
      id: 'dict-6-naemlich',
      sentence: 'Ich komme später, nämlich erst nach dem Training.',
      masked: 'Ich komme später, ___ erst nach dem Training.',
      target: 'nämlich',
      clue: 'Bindewort/Adverb: mit ä, aber ohne Dehnungs-h!'
    },
    {
      id: 'dict-6-spiegeln',
      sentence: 'Die ruhigen Wellen spiegeln den Abendhimmel.',
      masked: 'Die ruhigen Wellen ___ den Abendhimmel.',
      target: 'spiegeln',
      clue: 'Kleingeschriebenes Verb mit langem ie.'
    }
  ],
  7: [
    {
      id: 'dict-7-dass',
      sentence: 'Ich freue mich, dass du heute Zeit hast.',
      masked: 'Ich freue mich, ___ du heute Zeit hast.',
      target: 'dass',
      clue: 'Nach dem Komma folgt die Konjunktion (nicht »welches«).'
    },
    {
      id: 'dict-7-schliesslich',
      sentence: 'Nach langem Suchen fanden wir schließlich den Schlüssel.',
      masked: 'Nach langem Suchen fanden wir ___ den Schlüssel.',
      target: 'schließlich',
      clue: 'Langes ie und danach ein ß!'
    }
  ],
  8: [
    {
      id: 'dict-8-rhythmus',
      sentence: 'Die Band hält den schnellen Rhythmus mühelos.',
      masked: 'Die Band hält den schnellen ___ mühelos.',
      target: 'Rhythmus',
      clue: 'Fremdwort-Klassiker mit Rh, y und th – groß als Nomen.'
    },
    {
      id: 'dict-8-schwimmen',
      sentence: 'Beim Schwimmen im See vergaßen wir die Zeit.',
      masked: 'Beim ___ im See vergaßen wir die Zeit.',
      target: 'Schwimmen',
      clue: 'Signalwort »Beim« (= bei dem) macht das Verb zum Nomen!'
    }
  ]
};

export const wordsQuestionsByGrade = {
  5: [
    {
      type: 'WORTART',
      topic: 'Wortarten',
      title: 'Welche Wortart ist das markierte Wort?',
      hint: 'Frage danach: »Wie ist der Löwe?«',
      visual: 'sentence',
      sentence: 'Der [mutige] Löwe brüllt.',
      answers: ['Adjektiv', 'Nomen', 'Verb'],
      correct: 0,
      tip: 'Adjektive (Wie-Wörter) beschreiben Eigenschaften und werden kleingeschrieben.'
    },
    {
      type: 'WORTART',
      topic: 'Wortarten',
      title: 'Welche Wortart ist hier hervorgehoben?',
      hint: 'Es zeigt an, was Lina gerade tut.',
      visual: 'sentence',
      sentence: 'Lina [schreibt] einen Brief.',
      answers: ['Verb', 'Adjektiv', 'Artikel'],
      correct: 0,
      tip: '»schreibt« ist ein Verb (Tun-Wort) in der gebeugten Form.'
    },
    {
      type: 'RECHTSCHREIBUNG',
      topic: 'Rechtschreibung',
      title: 'Warum wird »Wetter« hier großgeschrieben?',
      hint: 'Denke an den passenden Begleiter: »das Wetter«.',
      visual: 'sentence',
      sentence: 'Das [Wetter] bleibt sonnig.',
      answers: ['Es ist ein Nomen', 'Es ist ein Verb', 'Es steht am Satzanfang'],
      correct: 0,
      tip: 'Nomen erkennst du am Artikel (der/die/das) und an der Großschreibung.'
    },
    {
      type: 'ZEITFORM',
      topic: 'Zeitformen',
      title: 'In welcher Zeitform steht »ging«?',
      hint: 'Es beschreibt etwas Vergangenes mit einem einzigen Verb.',
      visual: 'sentence',
      sentence: 'Gestern [ging] ich ins Kino.',
      answers: ['Präteritum', 'Präsens', 'Futur I'],
      correct: 0,
      tip: 'Das Präteritum (1. Vergangenheit) nutzt man besonders in Erzählungen.'
    },
    {
      type: 'WORTBILDUNG',
      topic: 'Wortarten',
      title: 'Welches Wort ist ein zusammengesetztes Nomen?',
      hint: 'Zwei Nomen verbinden sich zu einem neuen Begriff.',
      visual: 'sentence',
      sentence: 'Finde das Kompositum aus Haus + Tür.',
      answers: ['Haustür', 'glücklich', 'laufen'],
      correct: 0,
      tip: '»Haus« + »Tür« ergibt das zusammengesetzte Nomen »Haustür«.'
    },
    {
      type: 'BEGLEITER',
      topic: 'Wortarten',
      title: 'Was für ein Wort ist »Eine«?',
      hint: 'Ist es irgendeine Katze oder eine ganz bestimmte?',
      visual: 'sentence',
      sentence: '[Eine] Katze schläft auf dem Sofa.',
      answers: ['Unbestimmter Artikel', 'Bestimmter Artikel', 'Adjektiv'],
      correct: 0,
      tip: '»ein/eine« sind unbestimmte Artikel, »der/die/das« sind bestimmte Artikel.'
    }
  ],
  6: [
    {
      type: 'KASUS',
      topic: 'Kasus & Satzglieder',
      title: 'Welcher Fall (Kasus) liegt bei »dem Freund« vor?',
      hint: 'Frage: »Wem gebe ich den Ball?«',
      visual: 'sentence',
      sentence: 'Ich gebe [dem Freund] den Ball.',
      answers: ['Dativ (Wem?)', 'Akkusativ (Wen?)', 'Genitiv (Wessen?)'],
      correct: 0,
      tip: 'Die Frage »Wem?« führt immer zum Dativ.'
    },
    {
      type: 'KASUS',
      topic: 'Kasus & Satzglieder',
      title: 'Bestimme den Fall von »des Himmels«!',
      hint: 'Frage: »Wessen Farbe leuchtet?«',
      visual: 'sentence',
      sentence: 'Die Farbe [des Himmels] leuchtet.',
      answers: ['Genitiv (Wessen?)', 'Dativ (Wem?)', 'Nominativ (Wer?)'],
      correct: 0,
      tip: '»Wessen?« fragt nach dem Genitiv.'
    },
    {
      type: 'ZEITFORM',
      topic: 'Zeitformen',
      title: 'Welcher Satz steht im Perfekt?',
      hint: 'Das Perfekt wird mit »haben« oder »sein« + Partizip II gebildet.',
      visual: 'sentence',
      sentence: 'Wähle die vollendete Gegenwart (Perfekt).',
      answers: ['Wir haben gelacht.', 'Wir lachten laut.', 'Wir werden lachen.'],
      correct: 0,
      tip: '»haben gelacht« ist Perfekt, »lachten« Präteritum und »werden lachen« Futur I.'
    },
    {
      type: 'STEIGERUNG',
      topic: 'Wortarten',
      title: 'Wie lautet der Superlativ von »hoch«?',
      hint: 'Achte auf das »c«: hoch – höher – …',
      visual: 'sentence',
      sentence: 'Der Berg ist hoch, jener höher, dieser …',
      answers: ['am höchsten', 'am hochsten', 'höher'],
      correct: 0,
      tip: 'Bei »hoch« ändert sich der Stamm leicht: hoch – höher – am höchsten.'
    },
    {
      type: 'WORTART',
      topic: 'Wortarten',
      title: 'Welche Wortart ist das markierte Wort?',
      hint: 'Es zeigt die räumliche Lage an.',
      visual: 'sentence',
      sentence: 'Die Lampe hängt [über] dem Tisch.',
      answers: ['Präposition', 'Konjunktion', 'Pronomen'],
      correct: 0,
      tip: '»über« ist eine Präposition (Verhältniswort) und bestimmt den Fall danach.'
    },
    {
      type: 'WORTART',
      topic: 'Wortarten',
      title: 'Welche Wortart ist »Sie« am Satzanfang?',
      hint: 'Es ersetzt eine Gruppe von Kindern.',
      visual: 'sentence',
      sentence: '[Sie] entdecken eine geheime Karte.',
      answers: ['Pronomen', 'Artikel', 'Adjektiv'],
      correct: 0,
      tip: '»Sie« ist ein Personalpronomen (Fürwort).'
    }
  ],
  7: [
    {
      type: 'SATZBAU',
      topic: 'Satzbau & Komma',
      title: 'Welche Wortart ist »obwohl«?',
      hint: 'Das Wort verbindet Hauptsatz und Nebensatz und schiebt das Verb ans Ende.',
      visual: 'sentence',
      sentence: 'Ich bleibe hier, [obwohl] es spät ist.',
      answers: ['Unterordnende Konjunktion', 'Präposition', 'Adverb'],
      correct: 0,
      tip: '»obwohl« leitet einen Nebensatz ein und ist eine unterordnende Konjunktion.'
    },
    {
      type: 'PASSIV',
      topic: 'Zeitformen',
      title: 'Welcher Satz steht im Vorgangspassiv?',
      hint: 'Suche die Form mit »werden« + Partizip II.',
      visual: 'sentence',
      sentence: 'Hier passiert etwas mit dem Kuchen.',
      answers: ['Der Kuchen wird gebacken.', 'Wir backen einen Kuchen.', 'Der Kuchen ist lecker.'],
      correct: 0,
      tip: '»wird gebacken« beschreibt einen Vorgang im Passiv.'
    },
    {
      type: 'WORTART',
      topic: 'Wortarten',
      title: 'Welche Wortart ist »Dort«?',
      hint: 'Man kann das Wort nicht steigern und nicht deklinieren.',
      visual: 'sentence',
      sentence: '[Dort] wartet schon der Bus.',
      answers: ['Adverb', 'Adjektiv', 'Präposition'],
      correct: 0,
      tip: '»Dort« ist ein Ortsadverb (Umstandswort des Ortes).'
    },
    {
      type: 'ZEICHENSETZUNG',
      topic: 'Satzbau & Komma',
      title: 'In welchem Satz steht das Komma richtig?',
      hint: 'Vor der Konjunktion »dass« beginnt der Nebensatz.',
      visual: 'sentence',
      sentence: 'Prüfe die Kommasetzung vor dem Nebensatz.',
      answers: ['Ich weiß, dass du recht hast.', 'Ich weiß dass, du recht hast.', 'Ich, weiß dass du recht hast.'],
      correct: 0,
      tip: 'Hauptsatz und Nebensatz werden durch ein Komma direkt vor »dass« getrennt.'
    },
    {
      type: 'SATZGLIED',
      topic: 'Kasus & Satzglieder',
      title: 'Welches Satzglied ist »Am Abend«?',
      hint: 'Frage: »Wann funkeln die Sterne?«',
      visual: 'sentence',
      sentence: '[Am Abend] funkeln die Sterne.',
      answers: ['Adverbiale Bestimmung der Zeit', 'Subjekt', 'Akkusativobjekt'],
      correct: 0,
      tip: 'Mit »Wann?« fragt man nach der temporalen adverbialen Bestimmung.'
    },
    {
      type: 'ZEITFORM',
      topic: 'Zeitformen',
      title: 'Welche Zeitform ist »hatte ... gekauft«?',
      hint: 'Es liegt noch vor einer anderen Handlung in der Vergangenheit.',
      visual: 'sentence',
      sentence: 'Bevor der Film begann, [hatte] Mia Popcorn [gekauft].',
      answers: ['Plusquamperfekt', 'Perfekt', 'Präteritum'],
      correct: 0,
      tip: '»hatte gekauft« ist die Vorvergangenheit (Plusquamperfekt).'
    }
  ],
  8: [
    {
      type: 'RELATIVSATZ',
      topic: 'Satzbau & Komma',
      title: 'Welcher Relativsatz ist komplett richtig geschrieben?',
      hint: 'Kannst du das Wort durch »welches« ersetzen? Und schließt ein Komma den Einschub ab?',
      visual: 'sentence',
      sentence: 'Prüfe Relativpronomen und beide Kommas.',
      answers: [
        'Das Fahrrad, das neu ist, fährt schnell.',
        'Das Fahrrad, dass neu ist, fährt schnell.',
        'Das Fahrrad das neu ist fährt schnell.'
      ],
      correct: 0,
      tip: '»welches neu ist« passt → also »das« mit einem s, eingeschlossen von zwei Kommas.'
    },
    {
      type: 'MODUS',
      topic: 'Modus & Stilmittel',
      title: 'In welchem Modus steht das Verb »habe«?',
      hint: 'Es gibt indirekt wieder, was jemand anderes gesagt hat.',
      visual: 'sentence',
      sentence: 'Er sagte, er [habe] das Rätsel gelöst.',
      answers: ['Konjunktiv I (indirekte Rede)', 'Indikativ', 'Imperativ'],
      correct: 0,
      tip: 'Der Konjunktiv I (»er habe«) kennzeichnet die indirekte Rede.'
    },
    {
      type: 'MODUS',
      topic: 'Modus & Stilmittel',
      title: 'Welcher Modus drückt hier die Bedingung aus?',
      hint: 'Es geht um etwas Gedachtes oder Mögliches.',
      visual: 'sentence',
      sentence: 'Wenn ich Zeit [hätte], käme ich mit.',
      answers: ['Konjunktiv II (Möglichkeitsform)', 'Konjunktiv I', 'Plusquamperfekt'],
      correct: 0,
      tip: '»hätte« und »käme« stehen im Konjunktiv II für Irreales oder Wünsche.'
    },
    {
      type: 'RECHTSCHREIBUNG',
      topic: 'Rechtschreibung',
      title: 'Warum wird »Laufen« hier großgeschrieben?',
      hint: 'Schau dir das Wort direkt davor an.',
      visual: 'sentence',
      sentence: '[Das Laufen] im Park macht Spaß.',
      answers: ['Substantiviertes Verb (Signalwort: Das)', 'Weil es ein Adjektiv ist', 'Weil es am Satzende steht'],
      correct: 0,
      tip: 'Durch den Artikel »Das« wird das Verb zum Nomen (Substantivierung).'
    },
    {
      type: 'DAS/DASS',
      topic: 'Rechtschreibung',
      title: 'Wo werden »dass« und »das« korrekt verwendet?',
      hint: 'Nur das zweite bezieht sich direkt auf »Wetter« (welches).',
      visual: 'sentence',
      sentence: 'Wähle die fehlerfreie Schreibung.',
      answers: [
        'Ich hoffe, dass das Wetter hält.',
        'Ich hoffe, das dass Wetter hält.',
        'Ich hoffe, das das Wetter hält.'
      ],
      correct: 0,
      tip: 'Nach »Ich hoffe,« folgt die Konjunktion »dass«, vor »Wetter« der Artikel »das«.'
    },
    {
      type: 'STILMITTEL',
      topic: 'Modus & Stilmittel',
      title: 'Welches sprachliche Bild steckt in diesem Satz?',
      hint: 'Die Sonne tut etwas, das eigentlich nur Menschen können.',
      visual: 'sentence',
      sentence: 'Die Sonne lacht freundlich vom Himmel.',
      answers: ['Personifikation', 'Alliteration', 'Übertreibung'],
      correct: 0,
      tip: 'Bei einer Personifikation erhält etwas Unbelebtes menschliche Eigenschaften.'
    }
  ]
};
