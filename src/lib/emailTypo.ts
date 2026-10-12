// Fanger vanlige skrivefeil i e-postdomenet, f.eks. «gamil.com» → «gmail.com».
const FIX: Record<string, string> = {
  'gamil.com': 'gmail.com', 'gmial.com': 'gmail.com', 'gmal.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com', 'gmail.no': 'gmail.com', 'gmaill.com': 'gmail.com', 'gmali.com': 'gmail.com', 'gmail.cm': 'gmail.com', 'gmail.con': 'gmail.com',
  'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmai.com': 'hotmail.com', 'hotmail.co': 'hotmail.com', 'hotmail.con': 'hotmail.com', 'hotamil.com': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com', 'outlook.co': 'outlook.com',
  'icloud.co': 'icloud.com', 'iclod.com': 'icloud.com', 'icoud.com': 'icloud.com',
  'yahoo.co': 'yahoo.com', 'yaho.com': 'yahoo.com', 'online.n': 'online.no', 'onlie.no': 'online.no',
};

/** Returnerer foreslått rettet adresse, eller null hvis domenet ser riktig ut. */
export function emailTypo(email: string): string | null {
  const e = email.trim().toLowerCase();
  const at = e.lastIndexOf('@');
  if (at < 1) return null;
  const fix = FIX[e.slice(at + 1)];
  return fix ? `${e.slice(0, at)}@${fix}` : null;
}
