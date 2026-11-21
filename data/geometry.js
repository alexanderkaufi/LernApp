/**
 * Curriculum data for Geometry (Grades 5-8): angles, shapes, area, volume, and circles.
 */

export const geometryLabChallengesByGrade = {
  5: [
    {
      id: 'geo-5-right',
      mode: 'angle',
      prompt: 'Stelle genau einen rechten Winkel (90°) ein!',
      tip: 'Genau richtig! 90° steht wie eine perfekte Hausecke senkrecht.',
      checkAngle: deg => deg === 90
    },
    {
      id: 'geo-5-acute',
      mode: 'angle',
      prompt: 'Stelle einen spitzen Winkel zwischen 30° und 60° ein!',
      tip: 'Spitze Winkel sind kleiner als 90° – wie eine schmale Tortenspitze.',
      checkAngle: deg => deg >= 30 && deg <= 60
    },
    {
      id: 'geo-5-rect24',
      mode: 'area',
      shape: 'rect',
      prompt: 'Baue ein Rechteck mit genau 24 cm² Flächeninhalt!',
      tip: 'Stark! Länge mal Breite ergibt 24 cm² (z. B. 6 · 4 oder 8 · 3).',
      checkArea: (w, h, shape) => shape === 'rect' && w * h === 24
    }
  ],
  6: [
    {
      id: 'geo-6-obtuse',
      mode: 'angle',
      prompt: 'Stelle einen stumpfen Winkel zwischen 110° und 140° ein!',
      tip: 'Super! Ein stumpfer Winkel liegt zwischen 90° und 180°.',
      checkAngle: deg => deg >= 110 && deg <= 140
    },
    {
      id: 'geo-6-straight',
      mode: 'angle',
      prompt: 'Stelle genau einen gestreckten Winkel (180°) ein!',
      tip: 'Perfekt! 180° bildet genau eine gerade Linie.',
      checkAngle: deg => deg === 180
    },
    {
      id: 'geo-6-square20',
      mode: 'area',
      shape: 'rect',
      prompt: 'Baue ein Quadrat mit dem Umfang U = 20 cm!',
      tip: 'Genau! 4 gleich lange Seiten à 5 cm ergeben 20 cm Umfang (Fläche 25 cm²).',
      checkArea: (w, h, shape) => shape === 'rect' && w === 5 && h === 5
    }
  ],
  7: [
    {
      id: 'geo-7-supp',
      mode: 'angle',
      prompt: 'Stelle den Nebenwinkel zu 65° auf einer Geraden ein (zusammen 180°)!',
      tip: 'Klasse gerechnet! 180° − 65° = 115°.',
      checkAngle: deg => deg === 115
    },
    {
      id: 'geo-7-reflex',
      mode: 'angle',
      prompt: 'Stelle einen überstumpfen Winkel größer als 200° ein!',
      tip: 'Stimmt! Überstumpfe Winkel liegen zwischen 180° und 360°.',
      checkAngle: deg => deg > 200 && deg < 360
    },
    {
      id: 'geo-7-tri15',
      mode: 'area',
      shape: 'triangle',
      prompt: 'Schalte auf Dreieck und baue eine Fläche von 15 cm²!',
      tip: 'Perfekt! Grundseite mal Höhe geteilt durch 2 ergibt 15 cm².',
      checkArea: (w, h, shape) => shape === 'triangle' && w * h === 30
    }
  ],
  8: [
    {
      id: 'geo-8-tri70',
      mode: 'angle',
      prompt: 'Ein Dreieck hat die Winkel 50° und 60°. Stelle den dritten Winkel ein!',
      tip: 'Genau! 180° − 50° − 60° = 70°.',
      checkAngle: deg => deg === 70
    },
    {
      id: 'geo-8-hex120',
      mode: 'angle',
      prompt: 'Stelle einen Innenwinkel eines regelmäßigen Sechsecks ein (120°)!',
      tip: 'Perfekt! Jede Ecke einer Bienenwabe hat genau 120°.',
      checkAngle: deg => deg === 120
    },
    {
      id: 'geo-8-rect36',
      mode: 'area',
      shape: 'rect',
      prompt: 'Baue ein Rechteck mit Fläche A = 36 cm² UND Umfang U = 26 cm!',
      tip: 'Knobel-Profi! 9 cm · 4 cm = 36 cm² und 2 · (9 + 4) = 26 cm.',
      checkArea: (w, h, shape) => shape === 'rect' && w * h === 36 && 2 * (w + h) === 26
    }
  ]
};

export const geometryQuestionsByGrade = {
  5: [
    {
      type: 'WINKEL',
      topic: 'Winkelarten',
      title: 'Wie heißt ein Winkel mit genau 90°?',
      hint: 'Er sieht aus wie die Ecke eines Geodreiecks oder eines Blattes.',
      visual: 'svgShape',
      shape: 'angle',
      angle: 90,
      answers: ['Rechter Winkel', 'Spitzer Winkel', 'Stumpfer Winkel'],
      correct: 0,
      tip: 'Ein 90°-Winkel heißt rechter Winkel.'
    },
    {
      type: 'UMFANG',
      topic: 'Umfang & Fläche',
      title: 'Wie groß ist der Umfang des Rechtecks?',
      hint: 'Addiere alle vier Seitenlängen: 2 · (a + b).',
      visual: 'svgShape',
      shape: 'rect',
      widthLabel: '6 cm',
      heightLabel: '4 cm',
      answers: ['20 cm', '24 cm', '10 cm'],
      correct: 0,
      tip: '6 + 4 + 6 + 4 = 20 cm.'
    },
    {
      type: 'FLÄCHENINHALT',
      topic: 'Umfang & Fläche',
      title: 'Wie groß ist die Fläche dieses Quadrats?',
      hint: 'Multipliziere Seite mal Seite.',
      visual: 'svgShape',
      shape: 'rect',
      widthLabel: '5 cm',
      heightLabel: '5 cm',
      answers: ['25 cm²', '20 cm²', '10 cm²'],
      correct: 0,
      tip: '5 cm · 5 cm = 25 cm².'
    },
    {
      type: 'WINKEL',
      topic: 'Winkelarten',
      title: 'Welcher Winkeltyp ist hier zu sehen (45°)?',
      hint: 'Vergleiche den Winkel mit einem rechten Winkel (90°).',
      visual: 'svgShape',
      shape: 'angle',
      angle: 45,
      answers: ['Spitzer Winkel', 'Stumpfer Winkel', 'Gestreckter Winkel'],
      correct: 0,
      tip: 'Alle Winkel zwischen 0° und 90° heißen spitze Winkel.'
    },
    {
      type: 'KÖRPER',
      topic: 'Körper & Symmetrie',
      title: 'Wie viele Flächen hat ein Würfel?',
      hint: 'Stell dir einen normalen Spielwürfel mit den Zahlen 1 bis … vor.',
      visual: 'svgShape',
      shape: 'cube',
      label: 'Würfel',
      answers: ['6', '8', '12'],
      correct: 0,
      tip: 'Ein Würfel hat 6 gleich große Quadratflächen (plus 8 Ecken und 12 Kanten).'
    },
    {
      type: 'FLÄCHENINHALT',
      topic: 'Umfang & Fläche',
      title: 'Berechne den Flächeninhalt des Rechtecks',
      hint: 'Fläche A = Länge · Breite.',
      visual: 'svgShape',
      shape: 'rect',
      widthLabel: '8 cm',
      heightLabel: '3 cm',
      answers: ['24 cm²', '22 cm²', '11 cm²'],
      correct: 0,
      tip: '8 cm · 3 cm = 24 cm².'
    }
  ],
  6: [
    {
      type: 'WINKEL',
      topic: 'Winkelarten',
      title: 'Wie nennt man einen 135°-Winkel?',
      hint: 'Er ist größer als 90°, aber kleiner als eine gerade Linie (180°).',
      visual: 'svgShape',
      shape: 'angle',
      angle: 135,
      answers: ['Stumpfer Winkel', 'Spitzer Winkel', 'Überstumpfer Winkel'],
      correct: 0,
      tip: 'Winkel zwischen 90° und 180° nennt man stumpfe Winkel.'
    },
    {
      type: 'WINKEL',
      topic: 'Winkelarten',
      title: 'Wie groß ist ein gestreckter Winkel?',
      hint: 'Beide Schenkel liegen genau auf einer geraden Linie.',
      visual: 'svgShape',
      shape: 'angle',
      angle: 180,
      answers: ['180°', '90°', '360°'],
      correct: 0,
      tip: 'Ein gestreckter Winkel entspricht zwei rechten Winkeln: 180°.'
    },
    {
      type: 'UMKEHRAUFGABE',
      topic: 'Umfang & Fläche',
      title: 'Die Fläche ist 32 cm², eine Seite 8 cm. Wie lang ist b?',
      hint: 'Welche Zahl mal 8 ergibt 32?',
      visual: 'svgShape',
      shape: 'rect',
      widthLabel: '8 cm',
      heightLabel: 'b = ?',
      answers: ['4 cm', '8 cm', '24 cm'],
      correct: 0,
      tip: '32 cm² : 8 cm = 4 cm.'
    },
    {
      type: 'VOLUMEN',
      topic: 'Körper & Symmetrie',
      title: 'Welches Volumen hat ein Würfel mit Kante 3 cm?',
      hint: 'Rechne Länge · Breite · Höhe.',
      visual: 'svgShape',
      shape: 'cube',
      label: 'a = 3 cm',
      answers: ['27 cm³', '9 cm³', '18 cm³'],
      correct: 0,
      tip: 'V = 3 cm · 3 cm · 3 cm = 27 cm³.'
    },
    {
      type: 'SYMMETRIE',
      topic: 'Körper & Symmetrie',
      title: 'Wie viele Symmetrieachsen hat ein Quadrat?',
      hint: 'Denke an die zwei Mittellinien und die zwei Diagonalen.',
      visual: 'svgShape',
      shape: 'rect',
      widthLabel: 'a',
      heightLabel: 'a',
      answers: ['4', '2', '8'],
      correct: 0,
      tip: 'Ein Quadrat lässt sich an 4 Achsen deckungsgleich falten.'
    },
    {
      type: 'VOLUMEN',
      topic: 'Körper & Symmetrie',
      title: 'Berechne das Quader-Volumen: 5 cm · 4 cm · 2 cm',
      hint: 'Multipliziere alle drei Kantenlängen.',
      visual: 'expression',
      equation: 'V = 5 · 4 · 2 cm³',
      answers: ['40 cm³', '20 cm³', '11 cm³'],
      correct: 0,
      tip: '5 · 4 = 20, und 20 · 2 = 40 cm³.'
    }
  ],
  7: [
    {
      type: 'DREIECK',
      topic: 'Dreiecke & Winkel',
      title: 'Zwei Winkel sind 55° und 65°. Wie groß ist der dritte?',
      hint: 'Alle drei Winkel im Dreieck ergeben zusammen immer 180°.',
      visual: 'svgShape',
      shape: 'triangle',
      baseLabel: '55° / 65°',
      heightLabel: '?',
      answers: ['60°', '70°', '50°'],
      correct: 0,
      tip: '180° − (55° + 65°) = 180° − 120° = 60°.'
    },
    {
      type: 'FLÄCHENINHALT',
      topic: 'Dreiecke & Winkel',
      title: 'Berechne den Flächeninhalt des Dreiecks',
      hint: 'Ein Dreieck ist ein halbes Rechteck: (g · h) : 2.',
      visual: 'svgShape',
      shape: 'triangle',
      baseLabel: 'g = 8 cm',
      heightLabel: 'h = 5 cm',
      answers: ['20 cm²', '40 cm²', '13 cm²'],
      correct: 0,
      tip: '(8 cm · 5 cm) : 2 = 40 : 2 = 20 cm².'
    },
    {
      type: 'NEBENWINKEL',
      topic: 'Dreiecke & Winkel',
      title: 'Wie groß ist der Nebenwinkel zu 115°?',
      hint: 'Nebenwinkel ergänzen sich auf einer Geraden zu 180°.',
      visual: 'svgShape',
      shape: 'angle',
      angle: 115,
      answers: ['65°', '75°', '245°'],
      correct: 0,
      tip: '180° − 115° = 65°.'
    },
    {
      type: 'PARALLELOGRAMM',
      topic: 'Umfang & Fläche',
      title: 'Fläche eines Parallelogramms mit g = 7 cm und h = 4 cm?',
      hint: 'Schneide im Kopf links ein Dreieck ab und schiebe es nach rechts.',
      visual: 'expression',
      equation: 'A = g · h (7 cm · 4 cm)',
      answers: ['28 cm²', '14 cm²', '22 cm²'],
      correct: 0,
      tip: 'Beim Parallelogramm rechnest du Grundseite mal Höhe: 7 · 4 = 28 cm².'
    },
    {
      type: 'DREIECK',
      topic: 'Dreiecke & Winkel',
      title: 'Wie groß ist jeder Winkel im gleichseitigen Dreieck?',
      hint: 'Teile 180° auf drei gleich große Winkel auf.',
      visual: 'svgShape',
      shape: 'triangle',
      baseLabel: 'a = b = c',
      heightLabel: '',
      answers: ['60°', '45°', '90°'],
      correct: 0,
      tip: '180° : 3 = 60°.'
    },
    {
      type: 'KNOBELEI',
      topic: 'Umfang & Fläche',
      title: 'Ein Quadrat hat Umfang 36 cm. Wie groß ist seine Fläche?',
      hint: 'Berechne zuerst eine Seitenlänge (36 : 4).',
      visual: 'expression',
      equation: 'U = 36 cm → A = ?',
      answers: ['81 cm²', '36 cm²', '18 cm²'],
      correct: 0,
      tip: '36 : 4 = 9 cm Seitenlänge. Die Fläche beträgt 9 · 9 = 81 cm².'
    }
  ],
  8: [
    {
      type: 'KREIS',
      topic: 'Kreis & Thales',
      title: 'Ein Kreis hat Radius r = 5 cm. Wie groß ist der Durchmesser?',
      hint: 'Der Durchmesser reicht quer durch den Mittelpunkt: d = 2 · r.',
      visual: 'svgShape',
      shape: 'circle',
      radiusLabel: 'r = 5 cm',
      answers: ['10 cm', '25 cm', '5 cm'],
      correct: 0,
      tip: 'Der Durchmesser ist doppelt so groß wie der Radius: 2 · 5 cm = 10 cm.'
    },
    {
      type: 'KREISFLÄCHE',
      topic: 'Kreis & Thales',
      title: 'Welche Kreisfläche gehört zu Radius r = 3 cm?',
      hint: 'Die Formel lautet A = π · r².',
      visual: 'svgShape',
      shape: 'circle',
      radiusLabel: 'r = 3 cm',
      answers: ['9 · π cm²', '6 · π cm²', '3 · π cm²'],
      correct: 0,
      tip: 'r² = 3² = 9, also ist die Fläche 9 · π cm².'
    },
    {
      type: 'KREISUMFANG',
      topic: 'Kreis & Thales',
      title: 'Wie groß ist der Kreisumfang bei r = 4 cm?',
      hint: 'Nutze U = 2 · π · r.',
      visual: 'svgShape',
      shape: 'circle',
      radiusLabel: 'r = 4 cm',
      answers: ['8 · π cm', '16 · π cm', '4 · π cm'],
      correct: 0,
      tip: '2 · 4 · π = 8 · π cm.'
    },
    {
      type: 'THALESKREIS',
      topic: 'Kreis & Thales',
      title: 'Satz des Thales: Welcher Winkel entsteht über dem Durchmesser?',
      hint: 'Jeder Punkt auf dem Halbkreis bildet mit dem Durchmesser dasselbe.',
      visual: 'expression',
      equation: 'Halbkreis + Durchmesser → α = ?',
      answers: ['90°', '60°', '180°'],
      correct: 0,
      tip: 'Nach dem Satz des Thales ist jeder Winkel im Halbkreis ein rechter Winkel (90°).'
    },
    {
      type: 'PRISMA',
      topic: 'Körper & Symmetrie',
      title: 'Volumen eines Prismas mit G = 14 cm² und Höhe h = 5 cm?',
      hint: 'Volumen V = Grundfläche · Höhe.',
      visual: 'expression',
      equation: 'V = 14 cm² · 5 cm',
      answers: ['70 cm³', '19 cm³', '35 cm³'],
      correct: 0,
      tip: '14 · 5 = 70 cm³.'
    },
    {
      type: 'RECHTECK',
      topic: 'Umfang & Fläche',
      title: 'Rechteck mit Fläche 42 cm² und a = 6 cm: Wie groß ist U?',
      hint: 'Bestimme zuerst die fehlende Seite b.',
      visual: 'svgShape',
      shape: 'rect',
      widthLabel: '6 cm',
      heightLabel: 'A = 42 cm²',
      answers: ['26 cm', '13 cm', '21 cm'],
      correct: 0,
      tip: 'b = 42 : 6 = 7 cm. Der Umfang ist 2 · (6 + 7) = 26 cm.'
    }
  ]
};
