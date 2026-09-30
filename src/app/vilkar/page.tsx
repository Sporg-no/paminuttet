import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CONTACT } from '@/lib/env';

export const metadata: Metadata = { title: 'Vilkår' };

export default function Page() {
  return (
    <DocPage eyebrow="Vilkår" title="Vilkår for medlemskap" updated="30. september 2026">
      <h2>1. Hvem du handler med</h2>
      <p>PÅ MINUTTET drives av Erlend Namsvatn ENK, org.nr. [ORG.NR], [ADRESSE]. E-post: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
      <h2>2. Tjenesten</h2>
      <p>Medlemskapet gir tilgang til et nettbasert treningsprogram med nye økter hver uke i to spor (Gym og Hjemme) og fem nivåer, med innebygd timer. Nye uker publiseres søndag kveld. Tilgangen er personlig og kan ikke deles.</p>
      <h2>3. Pris og betaling</h2>
      <p>Prisen er 199 kr per måned eller 1 990 kr per år, inkludert eventuell merverdiavgift. Betaling skjer med kort via Stripe. Abonnementet fornyes automatisk ved slutten av hver periode til det avsluttes.</p>
      <h2>4. Prøveperiode</h2>
      <p>Nye medlemmer får 7 dager gratis. Du legger inn kort ved start, men ingenting trekkes i prøveperioden. Du får en påminnelse på e-post før prøveperioden slutter. Avslutter du ikke innen prøveperioden er over, går medlemskapet over til betalt, og første periode trekkes. Prøveperioden gis én gang per person.</p>
      <h2>5. Oppsigelse</h2>
      <p>Du kan avslutte når som helst under Min side. Tilgangen varer ut perioden du har betalt for. Det gis ikke refusjon for påbegynt periode, med mindre annet følger av lov.</p>
      <h2>6. Angrerett</h2>
      <p>Ved kjøp over internett har du normalt 14 dagers angrerett. Tilgangen til programmet starter umiddelbart. Når du kjøper, ber du uttrykkelig om at leveringen starter med en gang, og bekrefter at angreretten dermed faller bort, jf. angrerettloven § 22 bokstav n. Prøveperioden gir deg 7 dager til å vurdere tjenesten uten kostnad.</p>
      <h2>7. Helse og ansvar</h2>
      <p>Øktene er generelle og ikke tilpasset din helse. Er du usikker på om du tåler hard trening, eller har skader, sykdom eller er gravid, snakk med lege før du starter. Du trener på eget ansvar. Velg et nivå som passer deg, og stopp ved smerte eller ubehag.</p>
      <h2>8. Endringer</h2>
      <p>Vi kan endre innholdet i programmet fortløpende. Prisendringer varsles på e-post minst 30 dager før de gjelder, og du kan si opp før endringen trer i kraft.</p>
      <h2>9. Klager</h2>
      <p>Ta kontakt på <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Kommer vi ikke til enighet, kan du klage til Forbrukerrådet eller bruke EUs klageportal for nettkjøp.</p>
    </DocPage>
  );
}
