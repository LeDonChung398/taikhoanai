export type AuthRole = "admin" | "buyer";

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  balance: number;
  role: AuthRole;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

interface ApiErrorBody {
  message?: string | string[];
}

async function readErrorMessage(response: Response): Promise<string> {
  let fallback = "Request failed";

  if (response.status === 401) {
    fallback = "Invalid credentials";
  } else if (response.status >= 500) {
    fallback = "Server error";
  }

  try {
    const body = (await response.json()) as ApiErrorBody;
    const message = body.message;
    if (Array.isArray(message) && message.length > 0) {
      return message[0];
    }
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  } catch {
    // Ignore parse errors and return fallback.
  }

  return fallback;
}

export async function login(payload: {
  username: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as AuthResponse;
}

export async function register(payload: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }

  return (await response.json()) as AuthResponse;
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  const token = localStorage.getItem("accessToken");
  const response = await fetch(`${API_BASE}/auth/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response));
  }
}

export function getRoleRedirectPath(role: AuthRole): string {
  return role === "admin" ? "/isadmin" : "/buyer";
}
