/**
 * Curriculum data for Science & Technology (Grades 5-8):
 * interactive energy simulator systems, challenges, and grade-specific quizzes.
 */

export const scienceLabSystems = [
  {
    id: 'solar',
    name: 'Solarmodul',
    icon: '☀️',
    inputLabel: 'Sonnenlicht',
    usefulLabel: 'Strom (Nutzenergie)',
    lossLabel: 'Erwärmung',
    defaultPower: 120,
    defaultEfficiency: 20,
    note: 'Typische Solarmodule wandeln rund 20 % des Sonnenlichts direkt in Strom um.'
  },
  {
    id: 'water',
    name: 'Wasserkraftwerk',
    icon: '💧',
    inputLabel: 'Bewegtes Wasser',
    usefulLabel: 'Strom (Nutzenergie)',
    lossLabel: 'Reibung & Wärme',
    defaultPower: 100,
    defaultEfficiency: 85,
    note: 'Moderne Wasserturbinen erreichen sehr hohe Wirkungsgrade über 80 %.'
  },
  {
    id: 'led',
    name: 'LED-Lampe',
    icon: '💡',
    inputLabel: 'Strom',
    usefulLabel: 'Sichtbares Licht',
    lossLabel: 'Abwärme',
    defaultPower: 20,
    defaultEfficiency: 80,
    note: 'LEDs erzeugen viel Licht bei wenig Wärme – viel sparsamer als alte Glühlampen!'
  },
  {
    id: 'dynamo',
    name: 'Fahrrad-Dynamo',
    icon: '🚲',
    inputLabel: 'Muskelkraft',
    usefulLabel: 'Licht & Strom',
    lossLabel: 'Reibungswärme',
    defaultPower: 50,
    defaultEfficiency: 60,
    note: 'Deine Beinarbeit dreht einen Magneten im Dynamo und induziert Spannung.'
  }
];

export const scienceLabChallengesByGrade = {
  5: [
    {
      id: 'sci-5-water',
      prompt: 'Wähle das Wasserkraftwerk und stelle genau 100 W Eingangsleistung ein!',
      tip: 'Super! Bei 100 W lässt sich der Anteil direkt als Prozent ablesen.',
      check: (sysId, power) => sysId === 'water' && power === 100
    },
    {
      id: 'sci-5-solar',
      prompt: 'Wähle das Solarmodul und teste eine Eingangsleistung von mindestens 150 W!',
      tip: 'Stimmt! Mehr Sonnenstrahlung liefert am selben Modul mehr elektrische Leistung.',
      check: (sysId, power) => sysId === 'solar' && power >= 150
    }
  ],
  6: [
    {
      id: 'sci-6-led',
      prompt: 'Wähle die LED-Lampe und stelle mindestens 80 % Wirkungsgrad ein!',
      tip: 'Stark! Bei 80 % Wirkungsgrad gehen nur noch 20 % als Wärme verloren.',
      check: (sysId, _power, eff) => sysId === 'led' && eff >= 80
    },
    {
      id: 'sci-6-dynamo',
      prompt: 'Wähle den Fahrrad-Dynamo und stelle 50 W bei 60 % Wirkungsgrad ein!',
      tip: 'Perfekt! 60 % von 50 W ergeben genau 30 W Nutzleistung.',
      check: (sysId, power, eff) => sysId === 'dynamo' && power === 50 && eff === 60
    }
  ],
  7: [
    {
      id: 'sci-7-useful40',
      prompt: 'Stelle bei beliebigem System genau 40 W Nutzleistung ein!',
      tip: 'Klasse gerechnet! Eingangsleistung mal Wirkungsgrad ergibt exakt 40 W.',
      check: (_sysId, power, eff) => Math.round((power * eff) / 100) === 40
    },
    {
      id: 'sci-7-loss20',
      prompt: 'Finde eine Einstellung, bei der exakt 20 W Verlustwärme entstehen!',
      tip: 'Richtig! Eingangsleistung minus Nutzleistung ergibt 20 W Abwärme.',
      check: (_sysId, power, eff) => power - Math.round((power * eff) / 100) === 20
    }
  ],
  8: [
    {
      id: 'sci-8-wh120',
      prompt: 'Erzeuge genau 120 Wh Nutzenergie in einer Stunde (120 W Nutzleistung)!',
      tip: 'Perfekt! 120 W über 1 Stunde entsprechen 120 Wh elektrischer Energie.',
      check: (_sysId, power, eff) => Math.round((power * eff) / 100) === 120
    },
    {
      id: 'sci-8-half',
      prompt: 'Stelle 50 % Wirkungsgrad bei mindestens 160 W Eingangsleistung ein!',
      tip: 'Genau: Bei 50 % sind Nutzleistung und Abwärme exakt gleich groß.',
      check: (_sysId, power, eff) => eff === 50 && power >= 160
    }
  ]
};

export const scienceQuestionsByGrade = {
  5: [
    {
      type: 'ENERGIEFORMEN',
      topic: 'Energieumwandlung',
      title: 'Welche Energieumwandlung findet in einer Solarzelle statt?',
      hint: 'Schau dir an, was oben auftrifft und was aus dem Kabel kommt.',
      visual: 'scienceFlow',
      from: '☀️ Lichtenergie',
      to: '⚡ ?',
      answers: ['Lichtenergie → Elektrische Energie', 'Wärme → Bewegungsenergie', 'Schall → Lichtenergie'],
      correct: 0,
      tip: 'Solarzellen wandeln Sonnenlicht direkt in elektrische Energie um.'
    },
    {
      type: 'ENERGIEFORMEN',
      topic: 'Energieumwandlung',
      title: 'Welche Energie steckt in einem gespannten Flitzebogen?',
      hint: 'Die Sehne wird verformt und speichert Energie bis zum Loslassen.',
      visual: 'scienceFlow',
      from: '🏹 Gespannter Bogen',
      to: '🎯 Pfeilflug',
      answers: ['Spannenergie', 'Lichtenergie', 'Schallenergie'],
      correct: 0,
      tip: 'Verformte elastische Körper speichern Spannenergie.'
    },
    {
      type: 'STROMKREIS',
      topic: 'Elektrizität',
      title: 'Wann leuchtet eine Glühlampe im einfachen Stromkreis?',
      hint: 'Der Strom muss von einem Pol über die Lampe zurück zum anderen Pol fließen können.',
      visual: 'scienceFlow',
      from: '🔋 Batterie',
      to: '💡 Lampe',
      answers: [
        'Nur wenn der Stromkreis geschlossen ist',
        'Auch bei unterbrochenem Kabel',
        'Nur mit einer einzelnen Leitung'
      ],
      correct: 0,
      tip: 'Elektrischer Strom fließt nur in einem geschlossenen Stromkreis.'
    },
    {
      type: 'LEITER',
      topic: 'Elektrizität',
      title: 'Welcher Stoff ist ein guter elektrischer Leiter?',
      hint: 'Aus diesem Metall bestehen fast alle Stromkabel im Haushalt.',
      visual: 'expression',
      equation: 'Leiter vs. Isolator',
      answers: ['Kupfer', 'Holz', 'Kunststoff'],
      correct: 0,
      tip: 'Metalle wie Kupfer leiten Strom sehr gut; Holz und Kunststoff isolieren.'
    },
    {
      type: 'OPTIK',
      topic: 'Licht & Magnetismus',
      title: 'Wie breitet sich Licht im leeren Raum aus?',
      hint: 'Deshalb entstehen hinter Gegenständen scharfe Schatten.',
      visual: 'scienceFlow',
      from: '🔦 Taschenlampe',
      to: '🧱 Schatten',
      answers: ['Geradlinig', 'Im Zickzack', 'Nur um Ecken'],
      correct: 0,
      tip: 'Licht breitet sich in einem gleichmäßigen Medium immer geradlinig aus.'
    },
    {
      type: 'MAGNETISMUS',
      topic: 'Licht & Magnetismus',
      title: 'Welches Metall wird von einem Magneten stark angezogen?',
      hint: 'Denke an Nägel, Büroklammern oder den Kompass.',
      visual: 'scienceFlow',
      from: '🧲 Magnet',
      to: '❓ Metall',
      answers: ['Eisen', 'Aluminium', 'Kupfer'],
      correct: 0,
      tip: 'Eisen (sowie Nickel und Kobalt) ist ferromagnetisch – Aluminium und Kupfer nicht.'
    }
  ],
  6: [
    {
      type: 'AGGREGATZUSTAND',
      topic: 'Wärme & Stoffe',
      title: 'Bei welcher Temperatur schmilzt reines Eis bei Normaldruck?',
      hint: 'Das ist gleichzeitig der Gefrierpunkt von Wasser.',
      visual: 'scienceFlow',
      from: '🧊 Eis (fest)',
      to: '💧 Wasser (flüssig)',
      answers: ['0 °C', '10 °C', '100 °C'],
      correct: 0,
      tip: 'Reines Wasser gefriert und schmilzt bei 0 °C (und siedet bei 100 °C).'
    },
    {
      type: 'AGGREGATZUSTAND',
      topic: 'Wärme & Stoffe',
      title: 'Wie heißt der Übergang von flüssig zu gasförmig?',
      hint: 'Passiert beim Kochen von Wasser im Topf oder beim Trocknen von Wäsche.',
      visual: 'scienceFlow',
      from: '💧 Flüssig',
      to: '☁️ Gasförmig',
      answers: ['Verdampfen / Verdunsten', 'Kondensieren', 'Schmelzen'],
      correct: 0,
      tip: 'Beim Verdampfen/Verdunsten wird eine Flüssigkeit gasförmig; umgekehrt heißt es Kondensieren.'
    },
    {
      type: 'WÄRME',
      topic: 'Wärme & Stoffe',
      title: 'Wie wandert die Wärme durch einen Metalllöffel in heißem Tee?',
      hint: 'Die Teilchen im Metall stoßen ihre Nachbarn direkt an.',
      visual: 'scienceFlow',
      from: '☕ Heißer Tee',
      to: '🥄 Warmer Griff',
      answers: ['Wärmeleitung', 'Wärmestrahlung', 'Schallleitung'],
      correct: 0,
      tip: 'In festen Stoffen breitet sich Wärme vor allem durch Wärmeleitung aus.'
    },
    {
      type: 'AKUSTIK',
      topic: 'Schall & Strom',
      title: 'Warum hört man im luftleeren Weltraum keine Explosionen?',
      hint: 'Schall besteht aus schwingenden Teilchen.',
      visual: 'scienceFlow',
      from: '🔊 Schallquelle',
      to: '🌌 Vakuum',
      answers: [
        'Schall braucht ein Medium (Teilchen)',
        'Im Weltraum ist es zu kalt',
        'Schall bewegt sich dort schneller als Licht'
      ],
      correct: 0,
      tip: 'Ohne Luft, Wasser oder feste Stoffe können sich keine Schallwellen ausbreiten.'
    },
    {
      type: 'SCHALTUNG',
      topic: 'Elektrizität',
      title: 'Reihenschaltung zweier Lampen: Eine wird herausgedreht. Was passiert?',
      hint: 'Es gibt nur einen einzigen gemeinsamen Weg für den Strom.',
      visual: 'expression',
      equation: '🔋 — 💡1 — 💡2 — 🔋',
      answers: [
        'Die zweite Lampe geht ebenfalls aus',
        'Die zweite Lampe leuchtet doppelt so hell',
        'Nichts verändert sich'
      ],
      correct: 0,
      tip: 'In einer Reihenschaltung ist bei einer Lücke der gesamte Stromkreis unterbrochen.'
    },
    {
      type: 'SCHALTUNG',
      topic: 'Elektrizität',
      title: 'Parallelschaltung zweier Lampen: Eine wird herausgedreht. Was passiert?',
      hint: 'Jede Lampe hat ihren eigenen Zweig zur Stromquelle.',
      visual: 'expression',
      equation: 'Zweig 1: 💡1  ||  Zweig 2: 💡2',
      answers: [
        'Die zweite Lampe leuchtet normal weiter',
        'Beide Lampen gehen sofort aus',
        'Die Batterie entlädt sich schlagartig'
      ],
      correct: 0,
      tip: 'In der Parallelschaltung bleiben andere Zweige geschlossen und leuchten weiter.'
    }
  ],
  7: [
    {
      type: 'EINHEITEN',
      topic: 'Elektrizität',
      title: 'In welcher Einheit misst man die elektrische Spannung U?',
      hint: 'Auf Haushaltsbatterien steht z. B. »1,5 V«.',
      visual: 'expression',
      equation: 'Spannung U = ?',
      answers: ['Volt (V)', 'Ampere (A)', 'Watt (W)'],
      correct: 0,
      tip: 'Spannung wird in Volt (V) gemessen, Stromstärke in Ampere (A).'
    },
    {
      type: 'EINHEITEN',
      topic: 'Elektrizität',
      title: 'Welche Einheit gehört zur elektrischen Stromstärke I?',
      hint: 'Benannt nach dem französischen Physiker André-Marie …',
      visual: 'expression',
      equation: 'Stromstärke I = ?',
      answers: ['Ampere (A)', 'Volt (V)', 'Ohm (Ω)'],
      correct: 0,
      tip: 'Die Stromstärke I gibt an, wie viel Ladung pro Sekunde fließt – Einheit Ampere (A).'
    },
    {
      type: 'MECHANIK',
      topic: 'Kräfte & Hebel',
      title: 'Hebel: Links 20 N bei 2 m Abstand. Wo müssen rechts 40 N hängen?',
      hint: 'Für Gleichgewicht gilt: Kraft₁ · Hebelarm₁ = Kraft₂ · Hebelarm₂.',
      visual: 'expression',
      equation: '20 N · 2 m = 40 N · x',
      answers: ['1 m', '2 m', '4 m'],
      correct: 0,
      tip: '20 · 2 = 40, also muss rechts 40 · 1 = 40 gelten → 1 m Abstand.'
    },
    {
      type: 'BEWEGUNG',
      topic: 'Kräfte & Hebel',
      title: 'Ein Fahrrad legt 30 km in 2 Stunden zurück. Wie hoch ist v?',
      hint: 'Geschwindigkeit = Strecke : Zeit.',
      visual: 'expression',
      equation: 'v = 30 km : 2 h',
      answers: ['15 km/h', '60 km/h', '28 km/h'],
      correct: 0,
      tip: '30 km geteilt durch 2 h ergibt eine Durchschnittsgeschwindigkeit von 15 km/h.'
    },
    {
      type: 'OPTIK',
      topic: 'Licht & Stoffe',
      title: 'Was besagt das Reflexionsgesetz am ebenen Spiegel?',
      hint: 'Vergleiche den Winkel des ankommenden und des reflektierten Strahls.',
      visual: 'scienceFlow',
      from: '🔦 Einfallswinkel α',
      to: '🪞 Ausfallswinkel β',
      answers: ['Einfallswinkel = Ausfallswinkel', 'Ausfallswinkel ist immer 90°', 'Ausfallswinkel ist doppelt so groß'],
      correct: 0,
      tip: 'Am ebenen Spiegel gilt immer: Einfallswinkel gleich Reflexionswinkel.'
    },
    {
      type: 'DICHTE',
      topic: 'Licht & Stoffe',
      title: 'Warum schwimmt Eis auf flüssigem Wasser?',
      hint: 'Denke an die Dichteanomalie von Wasser beim Gefrieren.',
      visual: 'scienceFlow',
      from: '🧊 Eis (0 °C)',
      to: '💧 Wasser (4 °C)',
      answers: [
        'Eis hat eine geringere Dichte als Wasser',
        'Eis ist schwerer pro Kubikzentimeter',
        'Wasser drückt nur Salz nach oben'
      ],
      correct: 0,
      tip: 'Beim Gefrieren dehnt sich Wasser aus – Eis hat geringere Dichte und schwimmt.'
    }
  ],
  8: [
    {
      type: 'LEISTUNG',
      topic: 'Leistung & Wirkungsgrad',
      title: 'Welche Einheit gehört zur physikalischen Leistung P?',
      hint: 'Steht auf Föhn, Mikrowelle oder LED-Verpackungen.',
      visual: 'expression',
      equation: 'Leistung P = E : t',
      answers: ['Watt (W)', 'Joule (J)', 'Newton (N)'],
      correct: 0,
      tip: 'Leistung P wird in Watt (W) angegeben (1 W = 1 Joule pro Sekunde).'
    },
    {
      type: 'ENERGIERECHNUNG',
      topic: 'Leistung & Wirkungsgrad',
      title: 'Eine 500-W-Mikrowelle läuft 2 Stunden. Energiebedarf?',
      hint: 'Rechne 500 W in Kilowatt um: 0,5 kW · 2 h.',
      visual: 'expression',
      equation: 'E = 0,5 kW · 2 h',
      answers: ['1 kWh', '1000 kWh', '250 Wh'],
      correct: 0,
      tip: '0,5 kW · 2 h = 1 kWh (Kilowattstunde).'
    },
    {
      type: 'WIRKUNGSGRAD',
      topic: 'Leistung & Wirkungsgrad',
      title: 'Von 200 J Input werden 50 J als Licht genutzt. Wirkungsgrad η?',
      hint: 'Teile die Nutzenergie durch die zugeführte Energie.',
      visual: 'expression',
      equation: 'η = 50 J : 200 J',
      answers: ['25 %', '50 %', '4 %'],
      correct: 0,
      tip: '50 / 200 = 1/4 = 0,25 = 25 %.'
    },
    {
      type: 'OHMSCHES GESETZ',
      topic: 'Elektrizität',
      title: 'Spannung U = 12 V, Stromstärke I = 3 A. Wie groß ist R?',
      hint: 'Nach dem Ohmschen Gesetz gilt R = U : I.',
      visual: 'expression',
      equation: 'R = 12 V : 3 A',
      answers: ['4 Ω', '36 Ω', '9 Ω'],
      correct: 0,
      tip: '12 V : 3 A = 4 Ohm (Ω).'
    },
    {
      type: 'ENERGIEERHALTUNG',
      topic: 'Leistung & Wirkungsgrad',
      title: 'Warum spricht man im Alltag manchmal von „Energieverlust“?',
      hint: 'Denke an den Energieerhaltungssatz.',
      visual: 'scienceFlow',
      from: '⚡ Gesamtenergie',
      to: '💡 Nutz + 🔥 Wärme',
      answers: [
        'Energie bleibt erhalten, wandelt sich aber teils in unerwünschte Wärme',
        'Energie wird im Kabel komplett vernichtet',
        'Energie verschwindet nach einer Stunde von selbst'
      ],
      correct: 0,
      tip: 'Energie geht nie verloren – nur der nutzbare Anteil sinkt durch Wärmeentwertung.'
    },
    {
      type: 'NACHHALTIGKEIT',
      topic: 'Energieumwandlung',
      title: 'Welche Energiequellen zählen zu den erneuerbaren Energien?',
      hint: 'Sie wachsen nach oder stehen dauerhaft durch Sonne, Wind und Wasser bereit.',
      visual: 'scienceFlow',
      from: '🌬️ Wind & ☀️ Sonne',
      to: '⚡ Grüner Strom',
      answers: ['Wind- und Sonnenenergie', 'Steinkohle', 'Erdgas'],
      correct: 0,
      tip: 'Sonne, Wind und Wasserkraft erneuern sich fortlaufend, im Gegensatz zu fossilen Brennstoffen.'
    }
  ]
};
