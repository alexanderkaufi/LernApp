/**
 * Concise reference cards (Fietes Merk-Karten) across all 4 subjects.
 */

export const cheatSheetCards = [
  {
    subject: 'fractions',
    subjectLabel: 'Mathe · Brüche',
    title: 'Zähler & Nenner',
    formula: 'Zähler / Nenner',
    body: 'Unten (Nenner) steht, in wie viele gleich große Teile ein Ganzes geschnitten ist. Oben (Zähler) steht, wie viele Stücke gemeint sind.',
    example: '3/4 = 3 von 4 gleich großen Stücken'
  },
  {
    subject: 'fractions',
    subjectLabel: 'Mathe · Brüche',
    title: 'Kürzen & Erweitern',
    formula: 'a/b = (a · k)/(b · k)',
    body: 'Zähler und Nenner durch dieselbe Zahl teilen (Kürzen) oder mit derselben Zahl malnehmen (Erweitern). Der Wert bleibt exakt gleich!',
    example: '6/8 : 2 = 3/4 · · · 2/3 · 2 = 4/6'
  },
  {
    subject: 'fractions',
    subjectLabel: 'Mathe · Brüche',
    title: 'Addieren & Subtrahieren',
    formula: 'Gleicher Nenner zuerst!',
    body: 'Mache die Brüche zuerst gleichnamig. Rechne danach nur mit den Zählern – der gemeinsame Nenner bleibt unverändert.',
    example: '2/3 + 1/6 = 4/6 + 1/6 = 5/6'
  },
  {
    subject: 'fractions',
    subjectLabel: 'Mathe · Brüche',
    title: 'Mal & Geteilt (Kehrwert)',
    formula: 'a/b : c/d = a/b · d/c',
    body: 'Beim Multiplizieren rechnest du Zähler · Zähler und Nenner · Nenner. Beim Teilen drehst du den zweiten Bruch um (Kehrwert) und nimmst mal.',
    example: '3/4 : 1/2 = 3/4 · 2/1 = 6/4 = 3/2'
  },
  {
    subject: 'geometry',
    subjectLabel: 'Mathe · Geometrie',
    title: 'Winkelarten im Überblick',
    formula: '0° < spitz < 90° < stumpf < 180°',
    body: '90° ist ein rechter Winkel, 180° ein gestreckter Winkel. Zwischen 180° und 360° liegen überstumpfe Winkel.',
    example: '45° (spitz) · 90° (recht) · 135° (stumpf)'
  },
  {
    subject: 'geometry',
    subjectLabel: 'Mathe · Geometrie',
    title: 'Rechteck, Quadrat & Dreieck',
    formula: 'A_Rechteck = a · b  |  A_Dreieck = (g · h) : 2',
    body: 'Der Umfang U läuft einmal außen herum. Die Fläche A zählt die Quadratzentimeter innen drin.',
    example: 'Dreieck g=8, h=5 → A = (8·5):2 = 20 cm²'
  },
  {
    subject: 'geometry',
    subjectLabel: 'Mathe · Geometrie',
    title: 'Winkelsumme & Kreis',
    formula: 'α + β + γ = 180°  |  d = 2 · r',
    body: 'Die drei Innenwinkel im Dreieck ergeben immer 180°. Am Kreis gilt U = 2 · π · r und A = π · r².',
    example: 'r = 3 cm → A = 9 · π cm²'
  },
  {
    subject: 'words',
    subjectLabel: 'Deutsch · Sprache',
    title: 'Die 4 Fälle (Kasus)',
    formula: 'Wer? · Wessen? · Wem? · Wen?',
    body: 'Nominativ (Wer/Was?), Genitiv (Wessen?), Dativ (Wem?) und Akkusativ (Wen/Was?) findest du immer über die Kontrollfrage.',
    example: 'Ich helfe dem Freund (Wem? → Dativ)'
  },
  {
    subject: 'words',
    subjectLabel: 'Deutsch · Sprache',
    title: '»das« oder »dass«?',
    formula: 'welches / dieses → das',
    body: 'Kannst du das Wort durch »dieses«, »jenes« oder »welches« ersetzen, schreibst du »das« (Artikel oder Relativpronomen). Sonst steht die Konjunktion »dass«.',
    example: 'Ich hoffe, dass das Buch (welches) gefällt.'
  },
  {
    subject: 'words',
    subjectLabel: 'Deutsch · Sprache',
    title: 'Zeitformen, Passiv & Modus',
    formula: 'werden + Partizip II = Vorgangspassiv',
    body: 'Präteritum (ging), Perfekt (hat gekauft), Plusquamperfekt (hatte gekauft). Konjunktiv I zeigt indirekte Rede (er habe), Konjunktiv II Möglichkeiten (hätte).',
    example: 'Der Kuchen wird gebacken (Vorgangspassiv).'
  },
  {
    subject: 'science',
    subjectLabel: 'Natur & Technik',
    title: 'Strom, Spannung, Widerstand',
    formula: 'R = U : I  (Ω = V : A)',
    body: 'Spannung U misst man in Volt (V), Stromstärke I in Ampere (A), Widerstand R in Ohm (Ω). Strom fließt nur im geschlossenen Kreis.',
    example: 'U = 12 V, I = 3 A → R = 12 : 3 = 4 Ω'
  },
  {
    subject: 'science',
    subjectLabel: 'Natur & Technik',
    title: 'Leistung, Energie & Wirkungsgrad',
    formula: 'E = P · t  |  η = E_nutz : E_zu',
    body: 'Leistung P wird in Watt (W) gemessen. Energie bleibt immer erhalten, doch oft geht ein Teil als unerwünschte Wärme verloren.',
    example: '0,5 kW · 2 h = 1 kWh · · · 50 J / 200 J = 25 %'
  },
  {
    subject: 'english',
    subjectLabel: 'Englisch · Sprache',
    title: 'Simple Past vs. Present Perfect',
    formula: 'yesterday → Simple Past  |  already / since → Present Perfect',
    body: 'Abgeschlossene Zeitpunkte in der Vergangenheit (yesterday, 2022) nutzen Simple Past. Ereignisse mit Bezug bis heute (already, just, since, for) nutzen have/has + 3. Form.',
    example: 'I went home yesterday.  |  I have already arrived.'
  },
  {
    subject: 'english',
    subjectLabel: 'Englisch · Sprache',
    title: 'If-Clauses Typ 1 & Typ 2',
    formula: 'Typ 1: Present → will  |  Typ 2: Past → would',
    body: 'Typ 1 beschreibt realistische Bedingungen. Typ 2 nutzt man für gedachte oder unwahrscheinliche Vorstellungen (im If-Satz steht Simple Past, im Hauptsatz would).',
    example: 'If it rains, we will stay.  |  If I were rich, I would travel.'
  },
  {
    subject: 'english',
    subjectLabel: 'Englisch · Sprache',
    title: 'False Friends & Mengenwörter',
    formula: 'many (zählbar)  |  much (unzählbar)',
    body: 'Typische Stolperfallen: become = werden (nicht bekommen = get), library = Bücherei (nicht Buchhandlung = bookshop). Plural von child ist children.',
    example: 'How many books?  |  How much water?'
  }
];
