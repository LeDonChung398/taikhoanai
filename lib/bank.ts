export interface BankTheme {
  bg: string;
  text: string;
}

const BANK_NAME_MAP: Record<string, string> = {
  mb: "MB Bank",
  mbbank: "MB Bank",
  mbbankjsc: "MB Bank",
  vcb: "Vietcombank",
  vietcombank: "Vietcombank",
  tcb: "Techcombank",
  techcombank: "Techcombank",
  bidv: "BIDV",
  vpbank: "VPBank",
  acb: "ACB",
  tpbank: "TPBank",
  vib: "VIB",
  sacombank: "Sacombank",
  agribank: "Agribank"
};

const BANK_THEMES: Record<string, BankTheme> = {
  mb: { bg: "#003087", text: "#ffffff" },
  mbbank: { bg: "#003087", text: "#ffffff" },
  vcb: { bg: "#007c39", text: "#ffffff" },
  vietcombank: { bg: "#007c39", text: "#ffffff" },
  tcb: { bg: "#d92231", text: "#ffffff" },
  techcombank: { bg: "#d92231", text: "#ffffff" },
  bidv: { bg: "#005baa", text: "#ffffff" },
  vpbank: { bg: "#005f30", text: "#ffffff" },
  acb: { bg: "#0058a0", text: "#ffffff" },
  tpbank: { bg: "#6b21a8", text: "#ffffff" },
  vib: { bg: "#007ec5", text: "#ffffff" },
  sacombank: { bg: "#0063ae", text: "#ffffff" },
  agribank: { bg: "#d4242a", text: "#ffffff" }
};

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function getDisplayBankName(rawName: string): string {
  const key = normalize(rawName);
  return BANK_NAME_MAP[key] ?? rawName.trim();
}

export function getBankTheme(rawName: string): BankTheme {
  const key = normalize(rawName);
  return BANK_THEMES[key] ?? { bg: "#1d3f85", text: "#ffffff" };
}
