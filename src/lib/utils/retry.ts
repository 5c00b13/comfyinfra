export async function retry<T>(
  fn: () => Promise<T>,
  options: { retries?: number; signal?: AbortSignal } = {}
): Promise<T> {
  const { retries = 3, signal } = options;
  try {
    return await fn();
  } catch (error) {
    if (retries <= 1) throw error;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Using 1 second delay
    return retry(fn, { retries: retries - 1, signal });
  }
}