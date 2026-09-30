export function env(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Mangler miljøvariabel ${name}`);
  return v;
}
export const siteUrl = () => (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
export const CONTACT = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'post@paminuttet.no';
