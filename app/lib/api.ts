// On a physical device, localhost refers to the device itself.
// Set EXPO_PUBLIC_API_URL in .env to your machine's LAN IP, e.g. http://192.168.1.x:8080
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8080";

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message ?? `HTTP ${res.status}`);
  }

  return res.json();
}
