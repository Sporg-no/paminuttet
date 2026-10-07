/**
 * Øvelsesbank. Hvert navn i programmet som matcher et av `navn` blir trykkbart
 * og viser forklaringen. `video` er et engelsk søk på YouTube (bedre treff enn norsk).
 * Nye øvelser: legg til en linje her. Lengste treff vinner, så «push-ups på knær»
 * slår «push-ups».
 */
export type Ovelse = { navn: string[]; tittel: string; slik: string; tips?: string; lettere?: string; video: string };

export const OVELSER: Ovelse[] = [
  // Oppvarming
  { navn: ['standard oppvarming'], tittel: 'Standard oppvarming (4 min)', slik: '1 min jogg på stedet eller jumping jacks. Deretter 10 luftknebøy, 10 utfall bakover (5 per bein), 10 push-ups, 10 armsirkler hver vei og 30 s planke. Rolig tempo, du skal bli varm, ikke sliten.', video: 'full body warm up 4 minutes' },
  { navn: ['pvc pass-throughs', 'pass-throughs'], tittel: 'PVC pass-throughs', slik: 'Hold et kosteskaft eller en strikk med bredt grep foran hoftene. Før den med strake armer over hodet og ned bak ryggen, og tilbake.', tips: 'Bredere grep hvis det stopper i skuldrene.', video: 'pvc pass through shoulder' },
  { navn: ['scap pull-ups'], tittel: 'Scap pull-ups', slik: 'Heng i stanga med strake armer. Trekk skulderbladene ned og sammen så kroppen løftes noen centimeter, uten å bøye armene.', video: 'scap pull ups' },
  { navn: ['scap push-ups'], tittel: 'Scap push-ups', slik: 'Stå i push-up-posisjon med strake armer. La brystet synke mellom skuldrene, og press så gulvet bort så øvre rygg blir rund.', video: 'scap push ups' },
  { navn: ['band pull-aparts', 'pull-aparts'], tittel: 'Band pull-aparts', slik: 'Hold en strikk foran brystet med strake armer. Trekk den fra hverandre til den treffer brystet, klem skulderbladene sammen.', video: 'band pull apart' },
  { navn: ['face pulls'], tittel: 'Face pulls', slik: 'Fest strikken i hodehøyde. Trekk mot ansiktet med albuene høyt og ut til siden, tommelen peker bakover.', video: 'face pull band' },
  { navn: ['thorakalrotasjoner'], tittel: 'Thorakalrotasjoner', slik: 'På alle fire, én hånd bak hodet. Drei albuen ned mot motsatt hånd, så opp mot taket. Bevegelsen skjer i øvre rygg.', video: 'thoracic rotation quadruped' },
  { navn: ['world’s greatest stretch', "world's greatest stretch"], tittel: 'World’s greatest stretch', slik: 'Langt utfall fram. Sett hånden på samme side som fremre fot i gulvet, drei motsatt arm opp mot taket, og tilbake.', video: 'worlds greatest stretch' },
  { navn: ['good mornings'], tittel: 'Good mornings', slik: 'Stang eller hender bak nakken. Skyv hoftene bakover med rett rygg og lett bøyde knær til overkroppen er nesten vannrett, og reis deg.', video: 'good morning exercise form' },
  { navn: ['inchworms', 'inchworm med push-up', 'inchworm uten push-up', 'inchworm'], tittel: 'Inchworm', slik: 'Stå, bøy deg ned og sett hendene i gulvet. Gå ut på hendene til plankeposisjon, ta én push-up, og gå hendene tilbake til føttene. Reis deg.', lettere: 'Dropp push-upen, eller bøy knærne når du går ned.', video: 'inchworm push up' },
  { navn: ['armsirkler'], tittel: 'Armsirkler', slik: 'Strake armer ut til siden, store sirkler framover og bakover.', video: 'arm circles warm up' },

  // Bein
  { navn: ['luftknebøy', 'knebøy ned til stol', 'knebøy'], tittel: 'Knebøy', slik: 'Føttene i skulderbredde, tærne litt ut. Skyv hoftene bakover og ned til hofta er under kneet, knærne følger tærne. Press opp gjennom hele foten.', tips: 'Brystet opp og hælene i gulvet.', lettere: 'Sett deg ned på en stol og reis deg igjen.', video: 'air squat form' },
  { navn: ['knebøyhopp'], tittel: 'Knebøyhopp', slik: 'Knebøy ned til lårene er vannrett, og hopp eksplosivt opp. Land mykt med bøyde knær og gå rett ned i neste.', lettere: 'Vanlig knebøy, opp på tå på toppen.', video: 'jump squat form' },
  { navn: ['frontknebøy'], tittel: 'Frontknebøy', slik: 'Stanga hviler på skuldrene foran halsen, albuene høyt. Knebøy med oppreist overkropp.', video: 'front squat form' },
  { navn: ['goblet squats', 'goblet squat'], tittel: 'Goblet squat', slik: 'Hold en kettlebell eller manual inntil brystet med begge hender. Knebøy ned med albuene mellom knærne.', video: 'goblet squat form' },
  { navn: ['splittknebøy'], tittel: 'Splittknebøy', slik: 'Stå i langt utfallssteg. Senk bakre kne rett ned mot gulvet og press opp igjen. Føttene står stille.', video: 'split squat form' },
  { navn: ['utfall bakover', 'utfall'], tittel: 'Utfall bakover', slik: 'Stå rett. Ta et langt steg bakover og senk bakre kne til det nesten treffer gulvet. Press opp med fremre bein og sett foten tilbake. Bytt bein hver gang hvis ikke annet står.', tips: 'Fremre kne over foten, overkroppen oppreist.', lettere: 'Kortere steg, eller hold i en stol for balanse.', video: 'reverse lunge form' },
  { navn: ['utfallshopp'], tittel: 'Utfallshopp', slik: 'Start i utfall. Hopp opp og bytt bein i lufta, land i utfall med motsatt bein foran.', lettere: 'Utfall bakover uten hopp.', video: 'jumping lunges' },
  { navn: ['gående utfall'], tittel: 'Gående utfall', slik: 'Ta lange steg framover og senk bakre kne mot gulvet i hvert steg. Med vekt: manualene ned langs siden, eller i front rack på skuldrene hvis det står.', video: 'walking lunge form' },
  { navn: ['bulgarske', 'bulgarsk utfall'], tittel: 'Bulgarsk utfall', slik: 'Bakre fot på en stol eller benk. Senk bakre kne rett ned og press opp gjennom fremre fot. Alle reps på ett bein, så bytt.', video: 'bulgarian split squat form' },
  { navn: ['step-ups på stol', 'step-ups', 'box step-ups', 'trappetrinn'], tittel: 'Step-ups', slik: 'Sett hele foten på stolen, trappetrinnet eller kassa og gå opp til du står rett. Gå ned igjen kontrollert. Bytt bein hver gang.', tips: 'Press med beinet som står oppe, ikke sats fra gulvet.', video: 'step up exercise form' },
  { navn: ['step-overs'], tittel: 'Box step-overs', slik: 'Gå opp på kassa, stå rett, og gå ned på motsatt side.', video: 'box step over' },
  { navn: ['box jumps'], tittel: 'Box jumps', slik: 'Hopp opp på kassa med begge bein, stå helt rett på toppen, og gå ned igjen.', lettere: 'Step-ups.', video: 'box jump form' },
  { navn: ['seteløft på ett bein', 'seteløft på to bein', 'seteløft', 'glute bridges'], tittel: 'Seteløft', slik: 'Ligg på ryggen med bøyde knær og føttene i gulvet. Press hoftene opp til kroppen er rett fra skulder til kne, klem setet, og senk.', lettere: 'Seteløft på to bein.', video: 'glute bridge form' },
  { navn: ['hip thrust'], tittel: 'Hip thrust', slik: 'Skuldrene mot en benk eller sofa, føttene i gulvet. Press hoftene opp til vannrett og klem setet.', video: 'hip thrust form' },
  { navn: ['wall sit'], tittel: 'Wall sit', slik: 'Ryggen mot veggen, sett deg ned til lårene er vannrette, og hold.', video: 'wall sit' },
  { navn: ['tåhev'], tittel: 'Tåhev', slik: 'Stå på et trappetrinn med hælene utenfor. Gå helt opp på tå, og senk hælene under trinnet.', video: 'calf raise' },
  { navn: ['sideliggende hofteabduksjon'], tittel: 'Sideliggende hofteabduksjon', slik: 'Ligg på siden med strake bein. Løft øverste bein rett opp, tåa peker framover.', video: 'side lying hip abduction' },

  // Hofte og rygg
  { navn: ['rumensk markløft på ett bein'], tittel: 'Rumensk markløft på ett bein', slik: 'Stå på ett bein med lett bøyd kne. Fell overkroppen fram mens det andre beinet går bakover, til du kjenner strekk bak i låret. Reis deg.', lettere: 'Hold i en stol for balanse.', video: 'single leg romanian deadlift' },
  { navn: ['rumensk markløft'], tittel: 'Rumensk markløft', slik: 'Vekter foran lårene. Skyv hoftene bakover med rett rygg og lett bøyde knær, vektene glir ned langs beina til strekk bak i låret. Reis deg.', video: 'romanian deadlift dumbbell' },
  { navn: ['markløft'], tittel: 'Markløft', slik: 'Stanga over midtfoten. Grip rett utenfor knærne, rett rygg, og løft ved å presse beina i gulvet til du står rett.', video: 'deadlift form beginner' },
  { navn: ['kb-markløft'], tittel: 'Kettlebell-markløft', slik: 'Kettlebellen mellom føttene. Hoftene bakover, rett rygg, grip og reis deg.', video: 'kettlebell deadlift' },
  { navn: ['supermann', 'superman', 'rygghev'], tittel: 'Supermann', slik: 'Ligg på magen med armene fram. Løft armer, bryst og bein samtidig noen centimeter, hold kort, senk.', video: 'superman exercise' },

  // Overkropp
  { navn: ['push-ups på knær', 'på knær'], tittel: 'Push-ups på knær', slik: 'Som push-ups, men med knærne i gulvet. Kroppen rett fra knær til hode.', video: 'knee push ups form' },
  { navn: ['push-ups mot benk', 'mot benk'], tittel: 'Push-ups mot benk', slik: 'Hendene på en benk, stol eller kjøkkenbenk. Jo høyere, jo lettere.', video: 'incline push up form' },
  { navn: ['push-ups med føttene på stol'], tittel: 'Push-ups med føttene på stol', slik: 'Føttene på en stol, hendene i gulvet. Tyngre for skuldre og øvre bryst.', video: 'decline push up' },
  { navn: ['hand-release push-ups', 'hand-release'], tittel: 'Hand-release push-ups', slik: 'Push-up helt ned til brystet ligger i gulvet, løft hendene kort fra gulvet, og press opp.', video: 'hand release push up' },
  { navn: ['pike push-ups'], tittel: 'Pike push-ups', slik: 'Hoftene høyt så kroppen danner en omvendt V. Bøy armene og senk hodet mot gulvet foran hendene, press opp.', video: 'pike push up form' },
  { navn: ['push-ups'], tittel: 'Push-ups', slik: 'Hendene litt bredere enn skuldrene. Kroppen rett som en planke. Senk brystet til nesten gulvet, albuene ca. 45 grader ut, og press opp.', lettere: 'På knær, eller mot benk.', video: 'push up proper form' },
  { navn: ['bordroing'], tittel: 'Bordroing', slik: 'Ligg på ryggen under et solid bord og grip kanten. Kroppen rett, trekk brystet opp mot bordkanten og senk kontrollert.', tips: 'Sjekk at bordet tåler det. Bøyde knær gjør det lettere, strake bein tyngre.', video: 'table row exercise' },
  { navn: ['dips på stol', 'benkedips'], tittel: 'Dips på stol', slik: 'Hendene på kanten av en stol bak deg, beina fram. Senk deg til albuene er ca. 90 grader, og press opp.', video: 'chair dips form' },
  { navn: ['ring rows'], tittel: 'Ring rows', slik: 'Hold ringene eller TRX, len deg bakover med rett kropp og trekk brystet opp mot hendene. Mer vannrett er tyngre.', video: 'ring row form' },
  { navn: ['strict pull-ups', 'pull-ups med strikk', 'pull-ups', 'pull-up-test', 'trekk'], tittel: 'Pull-ups', slik: 'Heng med strake armer, trekk deg opp til haken er over stanga, og senk kontrollert.', lettere: 'Med strikk rundt stanga under foten, eller ring rows.', video: 'pull up form' },
  { navn: ['chest-to-bar'], tittel: 'Chest-to-bar', slik: 'Pull-up der brystet treffer stanga.', video: 'chest to bar pull up' },
  { navn: ['dead hang'], tittel: 'Dead hang', slik: 'Heng i stanga med strake armer og aktive skuldre.', video: 'dead hang' },
  { navn: ['benkpress'], tittel: 'Benkpress', slik: 'Ligg på benken med øynene under stanga. Senk stanga kontrollert til brystet og press opp. Føttene i gulvet.', video: 'bench press form' },
  { navn: ['db-benkpress', 'gulvpress'], tittel: 'Manualpress', slik: 'Ligg på benk eller gulv med en manual i hver hånd. Press opp over brystet og senk kontrollert.', video: 'dumbbell floor press' },
  { navn: ['pendlay-roing', 'foroverbøyd roing', 'db-roing', 'roing med manualer'], tittel: 'Foroverbøyd roing', slik: 'Fell overkroppen fram med rett rygg. Trekk vekten opp mot nedre del av brystet og senk.', video: 'bent over row form' },
  { navn: ['strict press', 'stående skulderpress', 'skulderpress'], tittel: 'Skulderpress', slik: 'Stå rett med vekten på skuldrene. Press rett opp over hodet til armene er strake, uten å bruke beina.', video: 'strict press form' },
  { navn: ['push press'], tittel: 'Push press', slik: 'Som skulderpress, men ta et lite dipp i knærne og bruk beina til å sende vekten opp.', video: 'push press form' },
  { navn: ['sidehev'], tittel: 'Sidehev', slik: 'En manual i hver hånd. Løft armene ut til siden til skulderhøyde med lett bøyde albuer.', video: 'lateral raise form' },
  { navn: ['hammercurls', 'curls', 'biceps curl'], tittel: 'Curls', slik: 'Albuene inntil kroppen, bøy armene og løft vekten opp mot skuldrene. Hammercurl: tommelen peker opp.', video: 'hammer curl form' },
  { navn: ['triceps pushdown', 'skull crushers'], tittel: 'Triceps', slik: 'Overarmene i ro, strekk armene helt ut mot motstanden.', video: 'triceps pushdown band' },

  // Mage
  { navn: ['planke med skuldertrykk', 'skuldertapp i planke', 'skuldertapp'], tittel: 'Planke med skuldertapp', slik: 'Høy planke på strake armer. Tapp motsatt skulder med én hånd om gangen uten at hoftene vugger.', lettere: 'Bredere føtter, eller på knær.', video: 'plank shoulder tap' },
  { navn: ['sideplanke'], tittel: 'Sideplanke', slik: 'Ligg på siden på albuen, løft hoftene så kroppen er rett, og hold.', lettere: 'Med nederste kne i gulvet.', video: 'side plank form' },
  { navn: ['planke'], tittel: 'Planke', slik: 'Underarmene i gulvet under skuldrene, kroppen rett fra hæl til hode. Spenn mage og sete, og hold.', lettere: 'Med knærne i gulvet.', video: 'plank proper form' },
  { navn: ['hollow hold', 'hollow rocks'], tittel: 'Hollow hold', slik: 'Ligg på ryggen, press korsryggen i gulvet, og løft skuldre og strake bein noen centimeter. Hold. Rocks: vugg fram og tilbake i samme posisjon.', lettere: 'Bøyde knær og armene langs kroppen.', video: 'hollow hold form' },
  { navn: ['mountain climbers'], tittel: 'Mountain climbers', slik: 'Høy planke på strake armer. Dra knærne vekselvis raskt inn mot brystet. Tell hvert bein hvis det står.', lettere: 'Rolig tempo, ett bein av gangen.', video: 'mountain climbers form' },
  { navn: ['v-ups'], tittel: 'V-ups', slik: 'Ligg på ryggen med strake armer over hodet. Løft overkropp og strake bein samtidig og møt tærne med hendene.', lettere: 'Tuck-ups eller liggende knehev.', video: 'v ups exercise' },
  { navn: ['tuck-ups'], tittel: 'Tuck-ups', slik: 'Ligg på ryggen. Trekk knærne inn mot brystet og løft overkroppen samtidig, armene rundt knærne.', video: 'tuck ups exercise' },
  { navn: ['liggende knehev'], tittel: 'Liggende knehev', slik: 'Ligg på ryggen med hendene under setet. Løft knærne mot brystet og senk sakte uten at føttene treffer gulvet.', video: 'lying knee raises' },
  { navn: ['hengende knehev', 'knees-to-elbows'], tittel: 'Hengende knehev', slik: 'Heng i stanga og løft knærne opp mot brystet, uten å svinge.', video: 'hanging knee raise' },
  { navn: ['toes-to-bar'], tittel: 'Toes-to-bar', slik: 'Heng i stanga og løft tærne helt opp til stanga.', video: 'toes to bar' },
  { navn: ['abmat sit-ups', 'sit-ups'], tittel: 'Sit-ups', slik: 'Ligg på ryggen med fotsålene mot hverandre eller føttene i gulvet. Rull opp til sittende og ned igjen.', video: 'abmat sit up' },
  { navn: ['pallof'], tittel: 'Pallof press', slik: 'Strikk festet fra siden. Hold den inntil brystet, press rett fram og hold uten å la deg dra rundt.', video: 'pallof press band' },

  // Kondisjon og hopp
  { navn: ['step-back burpees', 'step-back'], tittel: 'Step-back burpee', slik: 'Som burpee, men gå føttene bakover og fram én og én i stedet for å hoppe, og dropp hoppet på toppen.', video: 'step back burpee' },
  { navn: ['burpees over stanga', 'over stanga'], tittel: 'Burpee over stanga', slik: 'Burpee på langs ved stanga, og hopp over den med begge bein i stedet for hopp rett opp.', video: 'burpee over bar' },
  { navn: ['burpee lengdehopp'], tittel: 'Burpee lengdehopp', slik: 'Burpee, og hopp langt framover med begge bein i stedet for rett opp.', video: 'burpee broad jump' },
  { navn: ['burpee pull-ups'], tittel: 'Burpee pull-up', slik: 'Burpee under stanga, hopp opp og ta én pull-up.', video: 'burpee pull up' },
  { navn: ['burpees', 'burpee'], tittel: 'Burpee', slik: 'Fra stående: hendene i gulvet, hopp føttene bakover til planke, brystet i gulvet, press opp, hopp føttene inn og hopp opp med hendene over hodet.', lettere: 'Step-back burpee: gå bakover og fram, ingen hopp.', video: 'burpee proper form' },
  { navn: ['jumping jacks'], tittel: 'Jumping jacks', slik: 'Hopp beina ut og armene over hodet, og tilbake.', video: 'jumping jacks' },
  { navn: ['høye kneløft'], tittel: 'Høye kneløft', slik: 'Løp på stedet med knærne opp til hoftehøyde.', video: 'high knees exercise' },
  { navn: ['tuck jumps'], tittel: 'Tuck jumps', slik: 'Hopp rett opp og trekk knærne mot brystet i lufta. Land mykt.', video: 'tuck jumps' },
  { navn: ['skaterhopp', 'skøyteløperhopp', 'skatersteg'], tittel: 'Skaterhopp', slik: 'Hopp sidelengs fra ett bein til det andre, som en skøyteløper. Land mykt på ett bein med lett bøyd kne. Skatersteg: samme bevegelse uten hopp.', video: 'skater jumps' },
  { navn: ['bjørnegang'], tittel: 'Bjørnegang', slik: 'På hender og føtter med knærne rett over gulvet. Gå framover med motsatt hånd og fot samtidig, ryggen flat.', video: 'bear crawl' },
  { navn: ['krabbegang'], tittel: 'Krabbegang', slik: 'Sitt med hendene bak deg og løft setet fra gulvet. Gå framover eller bakover på hender og føtter.', video: 'crab walk exercise' },
  { navn: ['double unders'], tittel: 'Double unders', slik: 'Tauhopp der tauet går to ganger under føttene per hopp.', lettere: 'Single unders, tre ganger så mange.', video: 'double unders' },
  { navn: ['single unders', 'tau'], tittel: 'Hoppetau', slik: 'Vanlig tauhopp, ett tau per hopp. Små hopp på forfoten, håndleddene driver tauet.', video: 'jump rope basics' },
  { navn: ['bikeerg', 'sykkel'], tittel: 'BikeErg / sykkel', slik: 'Sykkel med vifte og skjerm. Kalorier eller meter står på skjermen. Assault- eller airbike går også.', video: 'bikeerg technique' },
  { navn: ['ski'], tittel: 'SkiErg', slik: 'Stakemaskin. Dra håndtakene ned med hele kroppen: armene, så hoftene, til hendene er ved knærne.', video: 'skierg technique' },
  { navn: ['ro'], tittel: 'Romaskin', slik: 'Bein, så kropp, så armer på vei bakover. Armer, så kropp, så bein på vei fram. Mest kraft fra beina.', video: 'concept2 rowing technique' },
  { navn: ['løp', 'jogg'], tittel: 'Løp', slik: 'Ute eller på mølle. Distansen står i økta. Ingen mulighet: 1 minutt høye kneløft per 200 m.', video: 'running form tips' },

  // Kettlebell, manualer, stang
  { navn: ['amerikansk', 'russisk', 'kb-sving'], tittel: 'Kettlebell-sving', slik: 'Kettlebellen mellom beina, rett rygg. Kast hoftene fram så kettlebellen svinger opp. Russisk: til skulderhøyde. Amerikansk: helt over hodet.', tips: 'Kraften kommer fra hoftene, armene er bare tau.', video: 'kettlebell swing form' },
  { navn: ['wallballs'], tittel: 'Wallballs', slik: 'Hold ballen foran brystet, knebøy ned, og kast ballen opp mot målet på veggen når du reiser deg. Ta imot og gå rett ned i neste.', video: 'wall ball form' },
  { navn: ['thrusters'], tittel: 'Thrusters', slik: 'Frontknebøy rett over i skulderpress i én bevegelse. Vekten på skuldrene, knebøy ned, og press over hodet på vei opp.', video: 'thruster form' },
  { navn: ['db snatch'], tittel: 'Manual-snatch', slik: 'Manualen mellom føttene. Løft eksplosivt med beina, trekk manualen tett inntil kroppen og stikk armen rett opp over hodet. Bytt hånd hver rep.', video: 'dumbbell snatch form' },
  { navn: ['db hang cleans', 'muscle clean', 'hang pull', 'høy pull', 'hang power clean', 'power clean'], tittel: 'Power clean', slik: 'Stanga fra gulvet (power clean) eller fra lårene (hang). Strekk hofter og knær eksplosivt, trekk stanga tett inntil kroppen og ta imot på skuldrene i en kvart knebøy, albuene fram.', tips: 'Lær den med lett vekt først.', video: 'hang power clean technique' },
  { navn: ['farmers carry'], tittel: 'Farmers carry', slik: 'En tung kettlebell eller manual i hver hånd. Gå med rett rygg og stramme skuldre.', video: 'farmers carry' },
];

/** Bygger én regex av alle navn, lengste først, med ordgrenser som også fungerer for æøå. */
const index = OVELSER.flatMap((o, i) => o.navn.map(n => ({ n: n.toLowerCase(), i }))).sort((a, b) => b.n.length - a.n.length);
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
export const OVELSE_RE = new RegExp(`(?<![\\p{L}\\-])(${index.map(x => esc(x.n)).join('|')})(?![\\p{L}\\-])`, 'giu');
export function finnOvelse(treff: string): Ovelse | undefined {
  const k = treff.toLowerCase();
  const hit = index.find(x => x.n === k);
  return hit ? OVELSER[hit.i] : undefined;
}
