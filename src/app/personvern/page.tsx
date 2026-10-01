import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CONTACT } from '@/lib/env';

export const metadata: Metadata = { title: 'Personvern' };

export default function Page() {
  return (
    <DocPage eyebrow="Personvern" title="Personvernerklæring" updated="30. september 2026">
      <h2>Behandlingsansvarlig</h2>
      <p>Erlend Namsvatn ENK, org.nr. 914 829 216, Kvernbakken 175, 4355 Kverneland, er ansvarlig for behandlingen av personopplysningene dine. Kontakt: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.</p>
      <h2>Hva vi lagrer, og hvorfor</h2>
      <ul>
        <li><b>E-post og innloggingsdata</b> for å gi deg tilgang til medlemsområdet. Grunnlag: avtale (GDPR art. 6 nr. 1 b).</li>
        <li><b>Abonnementsstatus</b> (plan, prøveperiode, periodeslutt) for å styre tilgangen. Grunnlag: avtale.</li>
        <li><b>Betalingsopplysninger</b> behandles av Stripe. Vi ser aldri kortnummeret ditt. Kvitteringer oppbevares i 5 år etter bokføringsloven. Grunnlag: rettslig forpliktelse (art. 6 nr. 1 c).</li>
        <li><b>E-post fra gratis-PDF-en</b> for å sende deg nyhetsbrev. Grunnlag: samtykke (art. 6 nr. 1 a). Du kan melde deg av når som helst.</li>
        <li><b>Samtykke til umiddelbar levering</b> og tidspunktet for det, som dokumentasjon av kjøpet.</li>
      </ul>
      <h2>Hvem som behandler data for oss</h2>
      <ul>
        <li>Supabase (database og innlogging), lagret i EU.</li>
        <li>Stripe (betaling), Irland. Kan overføre til USA under EUs standardavtaler og EU–US Data Privacy Framework.</li>
        <li>Vercel (drift av nettsiden), USA, under EU–US Data Privacy Framework.</li>
        <li>Resend (utsending av e-post), USA, under EUs standardavtaler.</li>
      </ul>
      <h2>Informasjonskapsler og lagring i nettleseren</h2>
      <p>Vi bruker bare nødvendige informasjonskapsler for å holde deg innlogget. Nivåvalget ditt og lydinnstillingen i timeren lagres lokalt i nettleseren din. Vi bruker ikke sporing eller annonsekapsler.</p>
      <h2>Hvor lenge</h2>
      <p>Kontoen slettes når du ber om det. Regnskapsdata oppbevares i 5 år. E-post fra nyhetsbrevet slettes når du melder deg av.</p>
      <h2>Dine rettigheter</h2>
      <p>Du kan be om innsyn, retting, sletting, begrensning og dataportabilitet, og du kan trekke tilbake samtykke. Send en e-post til <a href={`mailto:${CONTACT}`}>{CONTACT}</a>. Du kan klage til Datatilsynet.</p>
    </DocPage>
  );
}
