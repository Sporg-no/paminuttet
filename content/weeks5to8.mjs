// Syklus 2: uke 5–8. Rader: [bevegelse, Nivå 4, Nivå 3, Nivå 2, Nivå 1, Grunnmur]
// Kjør: node content/build-weeks5to8.mjs
const G = '40–45 min';
const H = '25–30 min';
const H7 = '30–35 min';
const V = 'Valgfri';
const r = (l, a, b, c, d, e) => [l, a, b, c, d, e];
const hvile = (l) => [l, 'Hvile', 'Hvile', 'Hvile', 'Hvile', 'Hvile'];
const std = 'Standard oppvarming, 4 minutter';

const gA = {
  man: ['2 runder: 250 m rolig ro, 10 luftknebøy, 10 utfall bakover, 10 PVC pass-throughs, 5 inchworms', 'Frontknebøy: tom stang × 5, deretter 2 lette sett'],
  tir: ['2 runder: 200 m rolig løp, 10 push-ups, 10 band pull-aparts, 10 ring rows', '2×10 benkpress med tom stang'],
  ons: ['2 runder: 250 m ski, 10 PVC pass-throughs, 10 luftknebøy, 5 inchworms', 'Tom stang, 5 av hver: markløft, markløft til hofte, høy pull, muscle clean, frontknebøy'],
  tor: ['2 runder: 250 m BikeErg, 10 glute bridges, 10 good mornings med tom stang, 5 world’s greatest stretch per side', 'Markløft: 3 oppvarmingssett'],
  fre: ['2 runder: 200 m løp, 10 PVC pass-throughs, 10 scap push-ups, 5 thorakalrotasjoner per side', '2×10 push press med tom stang'],
  lor: ['8 minutter rolig: 2 minutter hver av ro, ski, BikeErg og mobilitet'],
};

export const W5 = {
  title: 'Grunnlag 2',
  intro: 'Ny syklus. Nye øvelser, samme format. Start på nivået du endte på i forrige testuke.',
  gym: [
    { short: 'Man', day: 'Mandag', name: 'Frontminuttet', dur: G, A: gA.man,
      B: { t: 'Frontknebøy', l: ['Hver 2:30 × 5 sett: 5 reps @ 65 % (RPE 6)', 'Grunnmur: goblet squat 5×8 med 2 s pause nede'] },
      C: { fmt: '24:00 EMOM · 6 runder', timer: { t: 'emom', m: 24 }, rows: [
        r('1: BikeErg', '15/12 kal', '13/10 kal', '11/8 kal', '9/7 kal', '7/5 kal'),
        r('2: KB-sving', '15 amerikansk (24/16 kg)', '15 amerikansk (20/12 kg)', '15 russisk (16/12 kg)', '12 russisk (12/8 kg)', '10 KB-markløft (12/8 kg)'),
        r('3: Mage', '10 toes-to-bar', '8 toes-to-bar', '10 hengende knehev', '8 hengende knehev', '10 liggende knehev'),
        r('4: Push-ups', '15', '12', '10', '8 på boks', '8 mot benk')],
        score: 'Fullførte minutter (maks 24). 15–20 sekunder hvile hvert minutt.' },
      D: ['3 sett: 10 DB rumensk markløft + 30 s hollow hold'] },
    { short: 'Tir', day: 'Tirsdag', name: 'Bakkeløpet', dur: G, A: gA.tir,
      B: { t: 'Benkpress + pendlay-roing', l: ['4 supersett, 90 s hvile: 8 benkpress @ 62,5 % + 8 pendlay-roing', 'Grunnmur: DB-benkpress 4×10 + DB-roing 4×10 per side'] },
      C: { fmt: '3 runder · 1:30 hvile mellom rundene', timer: { t: 'up', cap: 0 }, rows: [
        r('Løp', '600 m', '600 m', '500 m', '400 m', '300 m'),
        r('Wallballs', '20 (9/6 kg)', '20 (9/6 kg)', '15 (6/4 kg)', '15 (6/4 kg)', '12 (4/3 kg)'),
        r('Burpees', '12', '10', '8', '8', '6 step-back')],
        score: 'Total tid inkludert hvile. Gjentas i testuka om tre uker, så noter tiden.' },
      D: ['3 supersett: 12 DB biceps curl + 12 triceps pushdown med strikk'] },
    { short: 'Ons', day: 'Onsdag', name: 'Kraftverket', dur: G, A: gA.ons,
      B: { t: 'Power clean', l: ['EMOM 10: 3 power cleans fra gulvet @ 60 %', 'Grunnmur: EMOM 10: 5 DB power cleans'] },
      C: { fmt: 'AMRAP 14', timer: { t: 'amrap', m: 14 }, rows: [
        r('Power clean', '6 (60/40 kg)', '6 (50/35 kg)', '6 (40/30 kg)', '6 (30/20 kg)', '6 DB cleans (12,5/7,5 kg)'),
        r('Box', '9 box jumps (60/50 cm)', '9 box jumps (60/50 cm)', '9 box jumps (50/40 cm)', '9 step-ups (50/40 cm)', '9 step-ups (40 cm)'),
        r('Trekk', '12 pull-ups', '9 pull-ups', '9 pull-ups med strikk', '12 ring rows', '9 ring rows')],
        score: 'Runder + reps. Mål nivå 4: 6+ runder.' },
      D: ['3 sett: 20 abmat sit-ups + 30 s superman hold'] },
    { short: 'Tor', day: 'Torsdag', name: 'Motoren 5', dur: G, A: gA.tor,
      B: { t: 'Markløft', l: ['Hver 2:30 × 5 sett: 5 reps @ 67,5 % (RPE 6)', 'Grunnmur: KB-markløft 5×10'] },
      C: { fmt: '4 runder · start hver 5:00', timer: { t: 'every', each: 300, rounds: 4 }, rows: [
        r('Ro', '500 m', '500 m', '400 m', '350 m', '300 m'),
        r('Ski', '300 m', '300 m', '250 m', '200 m', '150 m'),
        hvile('Resten av runden')],
        score: 'Tid på hver runde. Hold alle fire innenfor 10 sekunder.' },
      D: ['10 minutter rolig sykkel + tøying av hofter'] },
    { short: 'Fre', day: 'Fredag', name: 'Bunken 2.0', dur: G, A: gA.fre,
      B: { t: 'Push press + DB-roing', l: ['4 supersett, 90 s hvile: 6 push press @ 65 % + 10 DB-roing per side', 'Grunnmur: DB push press 4×10 + DB-roing 4×10 per side'] },
      C: { fmt: 'For tid · tidsgrense 18:00', timer: { t: 'up', cap: 18 }, rows: [
        r('Ro', '750 m', '750 m', '600 m', '500 m', '400 m'),
        r('Thrusters', '21 (43/30 kg)', '21 (35/25 kg)', '21 (30/20 kg)', '15 (20/15 kg)', '15 DB thrusters (7,5/5 kg)'),
        r('Trekk', '15 pull-ups', '12 pull-ups', '15 pull-ups med strikk', '15 ring rows', '12 ring rows'),
        r('Ro', '750 m', '750 m', '600 m', '500 m', '400 m')],
        score: 'Tid. Gjentas i testuka om tre uker, så noter tiden.' },
      D: ['3 sett: 12 DB sidehev + 15 face pulls med strikk'] },
    { short: 'Lør', day: 'Lørdag', name: 'Lørdagsminuttet 5', dur: V, optional: true, A: gA.lor, B: null,
      C: { fmt: '36:00 EMOM · 6 runder · partnervariant mulig', timer: { t: 'emom', m: 36 }, rows: [
        r('1: Ro', '15/12 kal', '13/10 kal', '11/9 kal', '9/7 kal', '7/5 kal'),
        r('2: Burpees', '10 over stanga', '9', '8', '7', '6 step-back'),
        r('3: Ski', '14/11 kal', '12/10 kal', '10/8 kal', '9/7 kal', '7/5 kal'),
        r('4: Gående utfall', '20 med DB (15/10 kg)', '20 med DB (10/7,5 kg)', '20', '16', '12'),
        r('5: BikeErg', '15/12 kal', '13/10 kal', '11/8 kal', '9/7 kal', '7/5 kal'),
        hvile('6: Hvile')],
        score: 'Fullførte arbeidsminutter (maks 30). Partner: dere bytter hvert minutt.' },
      D: ['10 minutter rolig nedtrapping'] },
  ],
  home: [
    { short: 'Man', day: 'Mandag', name: 'Gulvmatta', dur: H, A: [std, '2×10 knebøy i rolig tempo'],
      B: { t: 'Knebøy med pause', l: ['4×10 knebøy med 2 s pause nede, 60 s hvile', 'Grunnmur: knebøy ned til stol, 4×10', 'Med vekt: goblet squat, samme reps'] },
      C: { fmt: '24:00 EMOM · 6 runder · stille', timer: { t: 'emom', m: 24 }, rows: [
        r('1: Utfall bakover, vekslende', '24', '20', '16', '14', '12'),
        r('2: Push-ups', '15', '12', '10', '8 på knær', '8 mot benk'),
        r('3: Seteløft', '25', '22', '20', '18', '15'),
        r('4: Planke', '50 s', '45 s', '40 s', '30 s', '20 s')],
        score: 'Fullførte minutter (maks 24). 15–20 sekunder hvile hvert minutt.' },
      D: ['3 sett: 10 superman + 20 s sideplanke per side'] },
    { short: 'Tir', day: 'Tirsdag', name: 'Døra ut 5', dur: H, A: [std, '400 m rolig løp'],
      B: { t: 'Push-ups', l: ['5 sett med 3 s ned, maks minus 3 reps, 90 s hvile', 'Grunnmur: push-ups mot benk, 5×8'] },
      C: { fmt: '3 runder · 1:30 hvile mellom rundene', timer: { t: 'up', cap: 0 }, rows: [
        r('Løp', '600 m', '600 m', '500 m', '400 m', '300 m'),
        r('Knebøyhopp', '20', '18', '15', '12', '15 luftknebøy'),
        r('Burpees', '12', '10', '8', '8', '6 step-back')],
        score: 'Total tid inkludert hvile. Gjentas i testuka om tre uker, så noter tiden.' },
      D: ['3 sett: 12 dips på stol + 20 s hollow hold'] },
    { short: 'Ons', day: 'Onsdag', name: 'Bordet', dur: H, A: [std, '2×8 bordroing i rolig tempo'],
      B: { t: 'Bordroing', l: ['4×10 bordroing med 2 s ned, 60 s hvile', 'Grunnmur: bordroing med bøyde knær, 4×8', 'Med vekt: foroverbøyd DB-roing, 4×12'] },
      C: { fmt: 'AMRAP 14', timer: { t: 'amrap', m: 14 }, rows: [
        r('Mountain climbers, tell hvert bein', '30', '24', '20', '16', '12'),
        r('Utfall', '16 utfallshopp', '12 utfallshopp', '10 utfallshopp', '10 utfall bakover', '8 utfall bakover'),
        r('Mage', '12 V-ups', '10 V-ups', '12 tuck-ups', '10 tuck-ups', '12 liggende knehev')],
        score: 'Runder + reps.' },
      D: ['3 sett: 15 seteløft + 30 s planke'] },
    { short: 'Tor', day: 'Torsdag', name: 'Motoren Hjemme 5', dur: H, A: [std, '2×5 rolige burpees'],
      B: { t: 'Rumensk markløft på ett bein', l: ['4×10 per side med 3 s ned, 45 s hvile', 'Grunnmur: samme med én hånd på veggen', 'Med vekt: kettlebell eller manual i motsatt hånd'] },
      C: { fmt: '4 runder · start hver 4:00', timer: { t: 'every', each: 240, rounds: 4 }, rows: [
        r('Inchworm med push-up', '10', '8', '7', '6 med push-up på knær', '5 uten push-up'),
        r('Knebøyhopp', '20', '18', '15', '12', '15 luftknebøy'),
        r('Jumping jacks', 'Til 3:00', 'Til 3:00', 'Til 3:00', 'Til 3:00', 'Til 3:00'),
        hvile('Resten av runden')],
        score: 'Antall jumping jacks per runde. Hold antallet likt i alle fire.' },
      D: ['10 minutter rolig gåtur eller tøying'] },
    { short: 'Fre', day: 'Fredag', name: 'Bunken Hjemme 5', dur: H, A: [std, '2×6 pike push-ups'],
      B: { t: 'Skulder og mage', l: ['4 supersett, 60 s hvile: 8 pike push-ups + 10 hollow rocks', 'Grunnmur: 6 pike push-ups med hendene på stol + 20 s hollow hold med bøyde knær'] },
      C: { fmt: 'For tid · tidsgrense 16:00', timer: { t: 'up', cap: 16 }, rows: [
        r('Burpees', '20', '18', '15', '12', '10 step-back'),
        r('Luftknebøy', '50', '40', '35', '30', '25'),
        r('Push-ups', '30', '25', '20', '16 på knær', '16 mot benk'),
        r('Sit-ups', '40', '35', '30', '25', '20'),
        r('Burpees', '20', '18', '15', '12', '10 step-back')],
        score: 'Tid. Gjentas i testuka om tre uker, så noter tiden.' },
      D: ['3 sett: 10 superman + 30 s planke'] },
    { short: 'Lør', day: 'Lørdag', name: 'Lørdagsminuttet Hjemme 5', dur: V, optional: true, A: [std], B: null,
      C: { fmt: '30:00 EMOM · 6 runder · partnervariant mulig', timer: { t: 'emom', m: 30 }, rows: [
        r('1: Krabbegang, 5 m fram og tilbake', '6 lengder', '5 lengder', '4 lengder', '4 lengder', '3 lengder'),
        r('2: Utfall bakover, vekslende', '24', '20', '18', '16', '12'),
        r('3: Høye kneløft, tell hvert bein', '60', '50', '40', '36', '30'),
        r('4: Push-ups', '15', '12', '10', '8 på knær', '8 mot benk'),
        hvile('5: Hvile')],
        score: 'Fullførte arbeidsminutter (maks 24).' },
      D: ['10 minutter rolig nedtrapping'] },
  ],
};

export const W6 = {
  title: 'Bygg 2',
  intro: 'Mer volum og tyngre styrke. Gå opp ett nivå der forrige uke føltes kontrollert.',
  gym: [
    { short: 'Man', day: 'Mandag', name: 'Fronten 2', dur: G, A: gA.man,
      B: { t: 'Frontknebøy', l: ['Hver 2:30 × 5 sett: 4 reps @ 70 % (RPE 7)', 'Grunnmur: goblet squat 5×8, litt tyngre enn forrige uke'] },
      C: { fmt: '20:00 EMOM · 5 runder', timer: { t: 'emom', m: 20 }, rows: [
        r('1: Ro', '16/13 kal', '14/11 kal', '12/9 kal', '10/8 kal', '8/6 kal'),
        r('2: DB thrusters, 2 DB', '12 (22,5/15 kg)', '12 (17,5/12,5 kg)', '10 (12,5/10 kg)', '10 (10/7,5 kg)', '10 goblet squats (8/6 kg)'),
        r('3: Mage', '12 toes-to-bar', '10 toes-to-bar', '12 hengende knehev', '10 hengende knehev', '12 liggende knehev'),
        r('4: Burpees', '10 over stanga', '9', '8', '7', '6 step-back')],
        score: 'Fullførte minutter (maks 20).' },
      D: ['3 sett: 12 DB rumensk markløft + 30 s sideplanke per side'] },
    { short: 'Tir', day: 'Tirsdag', name: 'Bakkeløpet 2', dur: G, A: gA.tir,
      B: { t: 'Benkpress + pendlay-roing', l: ['4 supersett, 90 s hvile: 6 benkpress @ 70 % + 8 pendlay-roing', 'Grunnmur: DB-benkpress 4×10 + DB-roing 4×10 per side, tyngre enn forrige uke'] },
      C: { fmt: '4 runder · 1:30 hvile mellom · Grunnmur gjør 3', timer: { t: 'up', cap: 0 }, rows: [
        r('Løp', '400 m', '400 m', '400 m', '300 m', '200 m'),
        r('Wallballs', '25 (9/6 kg)', '20 (9/6 kg)', '20 (6/4 kg)', '15 (6/4 kg)', '12 (4/3 kg)'),
        r('Box', '15 box jumps (60/50 cm)', '12 box jumps (60/50 cm)', '12 box jumps (50/40 cm)', '12 step-ups (50/40 cm)', '10 step-ups (40 cm)')],
        score: 'Total tid inkludert hvile.' },
      D: ['3 supersett: 12 DB hammercurls + 12 benkedips'] },
    { short: 'Ons', day: 'Onsdag', name: 'Klokkespillet', dur: G, A: gA.ons,
      B: { t: 'Power clean', l: ['EMOM 10: 2 power cleans @ 70 %', 'Grunnmur: EMOM 10: 4 DB power cleans, tyngre enn forrige uke'] },
      C: { fmt: 'Start hvert 3. minutt · 6 runder (18 min)', timer: { t: 'every', each: 180, rounds: 6 }, rows: [
        r('Power clean', '5 (70/47,5 kg)', '5 (60/40 kg)', '5 (50/35 kg)', '5 (40/25 kg)', '5 DB cleans (15/10 kg)'),
        r('Burpees', '8 over stanga', '7 over stanga', '6', '5', '5 step-back'),
        r('Ro', 'Maks kal til 3:00', 'Maks kal til 3:00', 'Maks kal til 3:00', 'Maks kal til 3:00', 'Maks kal til 3:00')],
        score: 'Kalorier totalt på roeren.' },
      D: ['3 sett: 20 abmat sit-ups + 10 strict knehev'] },
    { short: 'Tor', day: 'Torsdag', name: 'Motoren 6', dur: G, A: gA.tor,
      B: { t: 'Markløft', l: ['Hver 2:30 × 5 sett: 4 reps @ 75 % (RPE 7)', 'Grunnmur: KB-markløft 5×10, tyngre enn forrige uke'] },
      C: { fmt: '5 runder · start hver 5:00', timer: { t: 'every', each: 300, rounds: 5 }, rows: [
        r('Ro', '500 m', '500 m', '400 m', '350 m', '300 m'),
        r('BikeErg', '15/12 kal', '13/10 kal', '11/8 kal', '9/7 kal', '7/5 kal'),
        hvile('Resten av runden')],
        score: 'Tid på hver runde. Langsomste runde teller.' },
      D: ['10 minutter rolig sykkel + tøying av hamstrings'] },
    { short: 'Fre', day: 'Fredag', name: 'Thruster-trappa', dur: G, A: gA.fre,
      B: { t: 'Push press + DB-roing', l: ['4 supersett, 90 s hvile: 5 push press @ 72,5 % + 8 tunge DB-roing per side', 'Grunnmur: DB push press 4×8 + DB-roing 4×10 per side'] },
      C: { fmt: 'For tid · tidsgrense 15:00 · ro etter hver runde', timer: { t: 'up', cap: 15 }, rows: [
        r('Repskjema', '21-15-9', '21-15-9', '15-12-9', '15-12-9', '12-9-6'),
        r('Thrusters', '43/30 kg', '35/25 kg', '30/20 kg', '20/15 kg', 'DB thrusters (7,5/5 kg)'),
        r('Trekk', 'Pull-ups', 'Pull-ups', 'Pull-ups med strikk', 'Ring rows', 'Ring rows'),
        r('Ro etter hver runde', '300 m', '300 m', '250 m', '200 m', '150 m')],
        score: 'Tid.' },
      D: ['3 sett: 12 DB sidehev + 15 face pulls med strikk'] },
    { short: 'Lør', day: 'Lørdag', name: 'Lørdagsminuttet 6', dur: V, optional: true, A: gA.lor, B: null,
      C: { fmt: '40:00 EMOM · 8 runder · partnervariant mulig', timer: { t: 'emom', m: 40 }, rows: [
        r('1: Ski', '15/12 kal', '13/10 kal', '11/9 kal', '9/7 kal', '7/5 kal'),
        r('2: Wallballs', '20 (9/6 kg)', '18 (9/6 kg)', '15 (6/4 kg)', '12 (6/4 kg)', '10 (4/3 kg)'),
        r('3: Ro', '15/12 kal', '13/10 kal', '11/9 kal', '9/7 kal', '7/5 kal'),
        r('4: DB snatch, vekslende', '16 (22,5/15 kg)', '14 (22,5/15 kg)', '12 (15/10 kg)', '10 (12,5/7,5 kg)', '10 DB push press (7,5/5 kg)'),
        hvile('5: Hvile')],
        score: 'Fullførte arbeidsminutter (maks 32).' },
      D: ['10 minutter rolig nedtrapping'] },
  ],
  home: [
    { short: 'Man', day: 'Mandag', name: 'Stoltrappa', dur: H, A: [std, '2×6 bulgarsk utfall per side, rolig'],
      B: { t: 'Bulgarsk utfall', l: ['4×10 per side med bakre fot på stol og 3 s ned, 60 s hvile', 'Grunnmur: utfall bakover med hånd på stol, 4×8 per side'] },
      C: { fmt: '24:00 EMOM · 8 runder', timer: { t: 'emom', m: 24 }, rows: [
        r('1: Step-ups på stol, vekslende', '24', '20', '18', '16', '12'),
        r('2: Push-ups', '16', '14', '12', '10 på knær', '10 mot benk'),
        r('3: Knebøyhopp', '15', '14', '12', '10', '12 luftknebøy')],
        score: 'Fullførte minutter (maks 24).' },
      D: ['3 sett: 15 seteløft + 30 s sideplanke per side'] },
    { short: 'Tir', day: 'Tirsdag', name: 'Døra ut 6', dur: H, A: [std, '400 m rolig løp'],
      B: { t: 'Push-ups med pause', l: ['5 sett med 1 s pause nede, maks minus 2 reps, 90 s hvile', 'Grunnmur: push-ups mot benk med pause, 5×8'] },
      C: { fmt: '4 runder · 1:30 hvile mellom · Grunnmur gjør 3', timer: { t: 'up', cap: 0 }, rows: [
        r('Løp', '400 m', '400 m', '400 m', '300 m', '200 m'),
        r('Utfall', '20 utfallshopp', '16 utfallshopp', '12 utfallshopp', '16 utfall bakover', '12 utfall bakover'),
        r('Burpees', '10', '9', '8', '7', '6 step-back')],
        score: 'Total tid inkludert hvile.' },
      D: ['3 sett: 12 dips på stol + 10 hollow rocks'] },
    { short: 'Ons', day: 'Onsdag', name: 'Klokkespillet Hjemme', dur: H, A: [std, '2×8 bordroing i rolig tempo'],
      B: { t: 'Bordroing', l: ['5×8 bordroing med 3 s ned, 60 s hvile', 'Grunnmur: bordroing med bøyde knær, 5×6', 'Med vekt: foroverbøyd DB-roing, 5×10'] },
      C: { fmt: 'Start hvert 3. minutt · 6 runder (18 min)', timer: { t: 'every', each: 180, rounds: 6 }, rows: [
        r('Bjørnegang, 5 m fram og tilbake', '6 lengder', '5 lengder', '4 lengder', '4 lengder', '3 lengder'),
        r('Knebøyhopp', '15', '14', '12', '10', '12 luftknebøy'),
        r('Mountain climbers', 'Til 3:00', 'Til 3:00', 'Til 3:00', 'Til 3:00', 'Til 3:00')],
        score: 'Mountain climbers totalt, tell hvert bein.' },
      D: ['3 sett: 10 superman + 30 s planke'] },
    { short: 'Tor', day: 'Torsdag', name: 'Motoren Hjemme 6', dur: H, A: [std, '2×5 rolige burpees'],
      B: { t: 'Seteløft på ett bein med hold', l: ['4×12 per side med 2 s hold på toppen, 45 s hvile', 'Grunnmur: seteløft på to bein, 4×15'] },
      C: { fmt: '20:00 EMOM · 5 runder', timer: { t: 'emom', m: 20 }, rows: [
        r('1: Burpee lengdehopp', '8', '7', '6', '5', '5 step-back burpees'),
        r('2: Skøyteløperhopp', '24', '20', '18', '16', '12 sidesteg'),
        r('3: Mountain climbers, tell hvert bein', '40', '36', '30', '24', '20'),
        hvile('4: Hvile')],
        score: 'Fullførte arbeidsminutter (maks 15).' },
      D: ['10 minutter rolig gåtur eller tøying'] },
    { short: 'Fre', day: 'Fredag', name: '21-15-9 Hjemme 2', dur: H, A: [std, '2×6 pike push-ups'],
      B: { t: 'Skulder og mage', l: ['4 supersett, 60 s hvile: 10 pike push-ups + 30 s hollow hold', 'Grunnmur: 8 pike push-ups med hendene på stol + 20 s hollow hold med bøyde knær'] },
      C: { fmt: 'For tid · tidsgrense 14:00 · løp etter hver runde', timer: { t: 'up', cap: 14 }, rows: [
        r('Repskjema', '21-15-9', '21-15-9', '15-12-9', '15-12-9', '12-9-6'),
        r('Knebøyhopp', 'Knebøyhopp', 'Knebøyhopp', 'Knebøyhopp', 'Luftknebøy', 'Luftknebøy'),
        r('Push-ups', 'Push-ups', 'Push-ups', 'Push-ups', 'Push-ups på knær', 'Push-ups mot benk'),
        r('Løp etter hver runde', '200 m', '200 m', '200 m', '150 m', '100 m')],
        score: 'Tid.' },
      D: ['3 sett: 10 superman + 20 s sideplanke per side'] },
    { short: 'Lør', day: 'Lørdag', name: 'Lørdagsminuttet Hjemme 6', dur: V, optional: true, A: [std], B: null,
      C: { fmt: '36:00 EMOM · 9 runder · partnervariant mulig', timer: { t: 'emom', m: 36 }, rows: [
        r('1: Burpees', '12', '10', '9', '8', '6 step-back'),
        r('2: Utfall', '20 utfallshopp', '16 utfallshopp', '12 utfallshopp', '16 utfall bakover', '12 utfall bakover'),
        r('3: Planke med skuldertrykk', '30', '26', '20', '16', '12 på knær'),
        hvile('4: Hvile')],
        score: 'Fullførte arbeidsminutter (maks 27).' },
      D: ['10 minutter rolig nedtrapping'] },
  ],
};

export const W7 = {
  title: 'Topp 2',
  intro: 'Tyngste uka i syklusen. Prioriter søvn og mat.',
  gym: [
    { short: 'Man', day: 'Mandag', name: 'Tungfronten', dur: G, A: gA.man,
      B: { t: 'Frontknebøy', l: ['Hver 3:00 × 4 sett: 3 reps @ 77,5 % (RPE 8)', 'Grunnmur: goblet squat 4×6, tyngste du klarer med god form'] },
      C: { fmt: 'Start hvert 2. minutt · 8 runder (16 min)', timer: { t: 'every', each: 120, rounds: 8 }, rows: [
        r('Ro', '250 m', '250 m', '200 m', '180 m', '150 m'),
        r('Mage', '10 toes-to-bar', '8 toes-to-bar', '10 hengende knehev', '8 hengende knehev', '10 liggende knehev'),
        r('Burpees', '6 over stanga', '5 over stanga', '5', '4', '4 step-back')],
        score: 'Tid på langsomste runde.' },
      D: ['3 sett: 10 DB rumensk markløft + 30 s hollow hold'] },
    { short: 'Tir', day: 'Tirsdag', name: 'Bakkeløpet 3', dur: G, A: gA.tir,
      B: { t: 'Benkpress + pendlay-roing', l: ['5 supersett, 2:00 hvile: 4 benkpress @ 77,5 % + 6 tunge pendlay-roing', 'Grunnmur: DB-benkpress 5×6 + DB-roing 5×8 per side, tungt'] },
      C: { fmt: '3 runder · 2:00 hvile mellom rundene', timer: { t: 'up', cap: 0 }, rows: [
        r('Løp', '800 m', '800 m', '600 m', '500 m', '400 m'),
        r('Gående utfall', '20 med DB (22,5/15 kg)', '20 med DB (17,5/12,5 kg)', '20 med DB (12,5/10 kg)', '16 med DB (10/7,5 kg)', '16 uten vekt'),
        r('Wallballs', '25 (9/6 kg)', '20 (9/6 kg)', '20 (6/4 kg)', '15 (6/4 kg)', '15 (4/3 kg)'),
        r('Trekk', '15 pull-ups', '12 pull-ups', '15 pull-ups med strikk', '15 ring rows', '12 ring rows')],
        score: 'Total tid inkludert hvile.' },
      D: ['3 supersett: 10 DB biceps curl + 10 DB skull crushers'] },
    { short: 'Ons', day: 'Onsdag', name: 'Åtte og åtte', dur: G, A: gA.ons,
      B: { t: 'Power clean', l: ['EMOM 8: 2 power cleans @ 75 %', 'Grunnmur: EMOM 8: 3 tunge DB power cleans'] },
      C: { fmt: 'To AMRAP 8 · 2:00 hvile mellom', timer: { t: 'up', cap: 18 }, rows: [
        r('Del 1: Power clean', '5 (70/47,5 kg)', '5 (60/40 kg)', '5 (50/35 kg)', '5 (40/25 kg)', '5 DB cleans (15/10 kg)'),
        r('Del 1: Box', '10 box jump overs', '8 box jump overs', '8 step-overs', '8 step-overs', '6 step-ups'),
        r('Del 2: Ski', '12/10 kal', '11/9 kal', '10/8 kal', '8/6 kal', '6/5 kal'),
        r('Del 2: Push-ups', '15', '12', '10', '8 på boks', '8 mot benk')],
        score: 'Runder + reps i hver del. Klokka går hele veien til 18:00.' },
      D: ['3 sett: 20 abmat sit-ups + 30 s superman hold'] },
    { short: 'Tor', day: 'Torsdag', name: 'Motoren 7', dur: G, A: gA.tor,
      B: { t: 'Markløft', l: ['Hver 3:00 × 4 sett: 3 reps @ 82,5 % (RPE 8)', 'Grunnmur: KB-markløft 4×8, tyngste du klarer med god form'] },
      C: { fmt: '6 runder · 3:00 arbeid, 1:00 hvile', timer: { t: 'every', each: 240, rounds: 6 }, rows: [
        r('Ski, runde 1, 3 og 5', 'Maks kal på 3:00', 'Maks kal på 3:00', 'Maks kal på 3:00', 'Maks kal på 3:00', 'Maks kal på 3:00'),
        r('Ro, runde 2, 4 og 6', 'Maks kal på 3:00', 'Maks kal på 3:00', 'Maks kal på 3:00', 'Maks kal på 3:00', 'Maks kal på 3:00')],
        score: 'Kalorier totalt. Hold samme fart i alle seks rundene.' },
      D: ['10 minutter rolig sykkel + tøying av hofter'] },
    { short: 'Fre', day: 'Fredag', name: 'Bunken 3.0', dur: G, A: gA.fre,
      B: { t: 'Push press + DB-roing', l: ['5 supersett, 2:00 hvile: 4 push press @ 77,5 % + 8 tunge DB-roing per side', 'Grunnmur: DB push press 5×6 + DB-roing 5×8 per side, tungt'] },
      C: { fmt: 'For tid · tidsgrense 22:00', timer: { t: 'up', cap: 22 }, rows: [
        r('Ro', '1000 m', '1000 m', '800 m', '600 m', '500 m'),
        r('Thrusters', '30 (43/30 kg)', '30 (35/25 kg)', '25 (30/20 kg)', '20 (20/15 kg)', '20 DB thrusters (7,5/5 kg)'),
        r('Trekk', '30 pull-ups', '24 pull-ups', '24 pull-ups med strikk', '24 ring rows', '20 ring rows'),
        r('Box', '30 box jumps (60/50 cm)', '24 box jumps (60/50 cm)', '24 box jumps (50/40 cm)', '20 step-ups (50/40 cm)', '16 step-ups (40 cm)'),
        r('Ro', '1000 m', '1000 m', '800 m', '600 m', '500 m')],
        score: 'Tid.' },
      D: ['3 sett: 12 DB sidehev + 15 face pulls med strikk'] },
    { short: 'Lør', day: 'Lørdag', name: 'Lørdagsminuttet 7', dur: V, optional: true, A: gA.lor, B: null,
      C: { fmt: '42:00 EMOM · 7 runder · partnervariant mulig', timer: { t: 'emom', m: 42 }, rows: [
        r('1: Ro', '16/13 kal', '14/11 kal', '12/9 kal', '10/8 kal', '8/6 kal'),
        r('2: Burpee lengdehopp', '8', '7', '6', '5', '5 step-back burpees'),
        r('3: Ski', '15/12 kal', '13/10 kal', '11/9 kal', '9/7 kal', '7/5 kal'),
        r('4: KB-sving', '20 amerikansk (24/16 kg)', '20 amerikansk (20/12 kg)', '20 russisk (16/12 kg)', '16 russisk (12/8 kg)', '12 KB-markløft (12/8 kg)'),
        r('5: BikeErg', '16/13 kal', '14/11 kal', '12/9 kal', '10/8 kal', '8/6 kal'),
        hvile('6: Hvile')],
        score: 'Fullførte arbeidsminutter (maks 35).' },
      D: ['10 minutter rolig nedtrapping'] },
  ],
  home: [
    { short: 'Man', day: 'Mandag', name: 'Dobbelminuttet Hjemme 2', dur: H7, A: [std, '2×6 bulgarsk utfall per side, rolig'],
      B: { t: 'Bulgarsk utfall med pause', l: ['5×10 per side med 2 s pause nede, 75 s hvile', 'Grunnmur: utfall bakover med hånd på stol, 5×8 per side'] },
      C: { fmt: 'Start hvert 2. minutt · 8 runder (16 min)', timer: { t: 'every', each: 120, rounds: 8 }, rows: [
        r('Burpees', '8', '7', '6', '5', '5 step-back'),
        r('Utfall', '16 utfallshopp', '14 utfallshopp', '12 utfallshopp', '12 utfall bakover', '10 utfall bakover')],
        score: 'Tid på langsomste runde.' },
      D: ['3 sett: 15 seteløft + 30 s sideplanke per side'] },
    { short: 'Tir', day: 'Tirsdag', name: 'Døra ut 7', dur: H7, A: [std, '400 m rolig løp'],
      B: { t: 'Push-ups med føttene på stol', l: ['5×8–12 med føttene på stol, 2:00 hvile', 'Klarer du ikke 8: vanlige push-ups med 2 s pause nede', 'Grunnmur: push-ups mot benk med pause, 5×8'] },
      C: { fmt: '3 runder · 2:00 hvile mellom rundene', timer: { t: 'up', cap: 0 }, rows: [
        r('Løp', '800 m', '800 m', '600 m', '500 m', '400 m'),
        r('Utfall bakover, vekslende', '30', '24', '20', '16', '14'),
        r('Push-ups', '25', '20', '16', '12 på knær', '12 mot benk'),
        r('Burpees', '15', '12', '10', '8', '8 step-back')],
        score: 'Total tid inkludert hvile.' },
      D: ['3 sett: 12 dips på stol + 10 hollow rocks'] },
    { short: 'Ons', day: 'Onsdag', name: 'Åtte og åtte Hjemme', dur: H7, A: [std, '2×8 bordroing i rolig tempo'],
      B: { t: 'Bordroing, strake bein', l: ['5×10 bordroing med strake bein og 3 s ned, 75 s hvile', 'Grunnmur: bordroing med bøyde knær, 5×8', 'Med vekt: foroverbøyd DB-roing, 5×10 tungt'] },
      C: { fmt: 'To AMRAP 8 · 2:00 hvile mellom', timer: { t: 'up', cap: 18 }, rows: [
        r('Del 1: Tuck jumps', '10', '8', '8', '6', '10 knebøy med tåhev'),
        r('Del 1: Mage', '12 V-ups', '10 V-ups', '12 tuck-ups', '10 tuck-ups', '12 liggende knehev'),
        r('Del 2: Skøyteløperhopp', '20', '18', '16', '14', '12 sidesteg'),
        r('Del 2: Push-ups', '12', '10', '8', '8 på knær', '8 mot benk')],
        score: 'Runder + reps i hver del. Klokka går hele veien til 18:00.' },
      D: ['3 sett: 10 superman + 30 s planke'] },
    { short: 'Tor', day: 'Torsdag', name: 'Motoren Hjemme 7', dur: H7, A: [std, '2×5 rolige burpees'],
      B: { t: 'Seteløft på ett bein', l: ['5×15 per side, 45 s hvile', 'Grunnmur: seteløft på to bein, 5×15'] },
      C: { fmt: '6 runder · 2:00 AMRAP og 1:00 hvile', timer: { t: 'every', each: 180, rounds: 6 }, rows: [
        r('Burpees', '5', '5', '4', '4', '3 step-back'),
        r('Knebøyhopp', '10', '10', '8', '8', '10 luftknebøy'),
        r('Mountain climbers, tell hvert bein', '20', '20', '16', '14', '12')],
        score: 'Runder per periode. Laveste periode teller.' },
      D: ['10 minutter rolig gåtur eller tøying'] },
    { short: 'Fre', day: 'Fredag', name: 'Bunken Hjemme 7', dur: H7, A: [std, '2×6 pike push-ups'],
      B: { t: 'Skulder og mage', l: ['5 supersett, 75 s hvile: 6 pike push-ups med føttene på stol + 12 hollow rocks', 'Grunnmur: 8 pike push-ups med hendene på stol + 20 s hollow hold med bøyde knær'] },
      C: { fmt: 'For tid · tidsgrense 20:00', timer: { t: 'up', cap: 20 }, rows: [
        r('Løp', '800 m', '800 m', '600 m', '400 m', '400 m'),
        r('Burpees', '30', '25', '20', '15', '15 step-back'),
        r('Luftknebøy', '60', '50', '40', '35', '30'),
        r('Push-ups', '40', '30', '25', '20 på knær', '20 mot benk'),
        r('Løp', '800 m', '800 m', '600 m', '400 m', '400 m')],
        score: 'Tid.' },
      D: ['3 sett: 10 superman + 20 s sideplanke per side'] },
    { short: 'Lør', day: 'Lørdag', name: 'Lørdagsminuttet Hjemme 7', dur: V, optional: true, A: [std], B: null,
      C: { fmt: '40:00 EMOM · 8 runder · partnervariant mulig', timer: { t: 'emom', m: 40 }, rows: [
        r('1: Burpee lengdehopp', '8', '7', '6', '5', '5 step-back burpees'),
        r('2: Luftknebøy', '30', '26', '22', '18', '15'),
        r('3: Planke', '50 s', '45 s', '40 s', '30 s', '20 s'),
        r('4: Skøyteløperhopp', '24', '20', '18', '16', '12 sidesteg'),
        hvile('5: Hvile')],
        score: 'Fullførte arbeidsminutter (maks 32).' },
      D: ['10 minutter rolig nedtrapping'] },
  ],
};

// Uke 8 gjentar testene fra uke 4 og øktene som er merket «gjentas i uke 8» i uke 5.
export function buildW8(w4, w5) {
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const gm = clone(w4.gym[0]);
  gm.name = 'FEMTEN 2';
  gm.B = { t: 'Frontknebøy 3RM', l: ['Bygg til en tung 3RM på 15 minutter. Hvil 2–3 minutter mellom de tunge settene.', 'Grunnmur: bygg over 4 sett til en tung goblet squat × 8'] };
  gm.A = clone(gA.man);
  gm.C.score = 'Runder + reps. Sammenlign med forrige testuke.';

  const gt = clone(w5.gym[1]);
  gt.name = 'Bakkeløpet (gjentak)';
  gt.B = { t: 'Benkpress 3RM + pull-up-test', l: ['Bygg til en tung 3RM på 12 minutter', 'Deretter: ett sett maks strict pull-ups', 'Grunnmur: DB-benkpress, bygg til en tung × 8, og maks ring rows på 1:00'] };
  gt.C.fmt = '3 runder · 1:30 hvile · samme nivå som for tre uker siden';
  gt.C.score = 'Total tid inkludert hvile. Sammenlign med økta for tre uker siden.';

  const go = clone(w4.gym[2]);
  go.name = 'Flyt 2';
  go.B = { t: 'Power clean, tung singel', l: ['EMOM 12: 1 rep. Bygg til en tung singel med god teknikk', 'Grunnmur: EMOM 12: 3 DB power cleans, lett til moderat'] };

  const gtor = clone(w4.gym[3]);
  gtor.name = 'Rotesten 2';
  gtor.B = { t: 'Markløft 3RM', l: ['Bygg til en tung 3RM på 15 minutter. Sammenlign med forrige testuke.', 'Grunnmur: bygg over 4 sett til en tung KB-markløft × 10'] };
  gtor.C.score = 'Tid. Sammenlign med forrige testuke.';

  const gf = clone(w5.gym[4]);
  gf.name = 'Bunken 2.0 (gjentak)';
  gf.B = { t: 'Push press + DB-roing, avlast', l: ['3 supersett: 5 push press @ 60 % + 10 DB-roing per side', 'Grunnmur: DB push press 3×8 + DB-roing 3×10 per side, lett'] };
  gf.C.fmt = 'For tid · tidsgrense 18:00 · samme nivå som for tre uker siden';
  gf.C.score = 'Tid. Sammenlign med økta for tre uker siden.';

  const gl = clone(w4.gym[5]);
  gl.name = 'Mini-racet 2';
  gl.C.score = 'Total tid. Sammenlign med forrige testuke, og noter tiden på hver løpedel.';

  const hm = clone(w4.home[0]);
  hm.name = 'FEMTEN Hjemme 2';
  hm.C.score = 'Runder + reps. Sammenlign med forrige testuke.';

  const ht = clone(w5.home[1]);
  ht.name = 'Døra ut 5 (gjentak)';
  ht.B = { t: 'Test: maks push-ups', l: ['Ett sett med maks push-ups: brystet i gulvet og strake armer på toppen. Settet er over når formen brekker.', 'Grunnmur: maks push-ups mot benk', 'Hvil 3 minutter før C.'] };
  ht.C.fmt = '3 runder · 1:30 hvile · samme nivå som for tre uker siden';
  ht.C.score = 'Total tid inkludert hvile. Sammenlign med økta for tre uker siden.';

  const ho = clone(w4.home[2]);
  ho.name = 'Flyt Hjemme 2';

  const htor = clone(w4.home[3]);
  htor.name = 'Burpeetesten 2';
  htor.C.score = 'Antall burpees. Sammenlign med forrige testuke.';

  const hf = clone(w5.home[4]);
  hf.name = 'Bunken Hjemme 5 (gjentak)';
  hf.B = { t: 'Skulder, avlast', l: ['3×6 pike push-ups i rolig tempo', 'Grunnmur: 3×6 pike push-ups med hendene på stol'] };
  hf.C.fmt = 'For tid · tidsgrense 16:00 · samme nivå som for tre uker siden';
  hf.C.score = 'Tid. Sammenlign med økta for tre uker siden.';

  const hl = clone(w4.home[5]);
  hl.name = 'Mini-racet Hjemme 2';
  hl.C.score = 'Total tid. Sammenlign med forrige testuke.';

  return {
    title: 'Test 2',
    intro: 'Gjenta testene fra forrige testuke og øktene fra for tre uker siden. Noter alt og sammenlign.',
    gym: [gm, gt, go, gtor, gf, gl],
    home: [hm, ht, ho, htor, hf, hl],
  };
}
