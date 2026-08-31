export async function adminFetch(input: string, init?: RequestInit) {
  return fetch(input, { ...init, credentials: 'include' });
}

export async function adminJson<T = unknown>(
  input: string,
  init?: RequestInit
): Promise<T> {
  const res = await adminFetch(input, init);
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(
      (data && typeof data === 'object' && 'error' in data && data.error) ||
        'Request failed'
    );
  }
  return data as T;
}
