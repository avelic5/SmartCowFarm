
export class ApiError extends Error {
  status: number;
  bodyText?: string;

  constructor(message: string, status: number, bodyText?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.bodyText = bodyText;
  }
}

// ISPRAVKA: Vite koristi MODE, ne DEV
export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;

  if (configured?.trim()) {
    return configured.trim().replace(/\/$/, "");
  }

  // Vite development mode
  if (import.meta.env.MODE === "development") {
    return "http://localhost:5000";
  }

  // Production - prazan za relativne putanje
  return "";
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const normalizedPath =
    baseUrl.endsWith("/api") && path.startsWith("/api/")
      ? path.slice("/api".length)
      : path;

  const url = `${baseUrl}${normalizedPath.startsWith("/") ? "" : "/"}${normalizedPath}`;

  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  if (init?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...init,
      headers,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    throw new Error(
      message.toLowerCase().includes("fetch")
        ? "Ne mogu se povezati sa serverom. Provjerite internet ili CORS podešavanja."
        : "Neuspješan zahtjev prema serveru.",
    );
  }

  if (!response.ok) {
    let bodyText: string | undefined;
    try {
      bodyText = await response.text();
    } catch {
      bodyText = undefined;
    }
    throw new ApiError(
      `API request failed: ${response.status} ${response.statusText}`,
      response.status,
      bodyText,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
