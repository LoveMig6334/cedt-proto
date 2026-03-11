export type Employee = {
  id: string;
  name: string;
  email: string;
  password: string; // plain text for mock
  title: string;
  department: string;
  role: "factory_manager" | "employee";
  isPermanent?: boolean;
};

export type Factory = {
  id: string;
  name: string;
  type: string;
  province: string;
  district: string;
  subDistrict: string;
  zipcode: string;
  address: string;
  lat: number;
  lng: number;
};

export type Session = {
  userId: string;
  factoryId: string;
};

const ACCOUNTS_KEY = "fp_accounts";
const FACTORY_KEY = "fp_factory";
const SESSION_KEY = "fp_session";

export function getAccounts(): Employee[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: Employee[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function getFactory(): Factory | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(FACTORY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveFactory(factory: Factory): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FACTORY_KEY, JSON.stringify(factory));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function findAccountByEmail(email: string): Employee | null {
  const accounts = getAccounts();
  return (
    accounts.find((a) => a.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

export function validateLogin(
  email: string,
  password: string,
): Employee | null {
  const account = findAccountByEmail(email);
  if (!account) return null;
  if (account.password !== password) return null;
  return account;
}

// ── Suppliers ──────────────────────────────────────────────

export type Supplier = {
  id: string;
  name: string;
  type: string;
  rating: number;
  province: string;
  products: string[];
  verified: boolean;
};

const SUPPLIERS_KEY = "fp_suppliers";

export function getSelectedSupplierIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SUPPLIERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSelectedSupplierIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUPPLIERS_KEY, JSON.stringify(ids));
}
