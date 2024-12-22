export const CONFIG = {
  POCKETBASE_URL: import.meta.env.VITE_POCKETBASE_URL || 'https://pocketbase-x0ok4kwc80k80gkk8g48cco0.74.208.197.138.sslip.io',
  API_TIMEOUT: 15000, // Increased timeout
  RETRY_ATTEMPTS: 3,  // Increased retries
  RETRY_DELAY: 1000,
  ERROR_MESSAGES: {
    FETCH_FAILED: 'Unable to load templates. Please try again later.',
    NO_TEMPLATES: 'No templates available',
  }
} as const;