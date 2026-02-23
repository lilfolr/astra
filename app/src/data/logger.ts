/**
 * Simple logger for data layer operations.
 * It uses __DEV__ to only log during development.
 */
export const dataLogger = {
  log: (...args: any[]) => {
    if (__DEV__) {
      console.log(...args);
    }
  },
  logRequest: (name: string, params?: any) => {
    if (__DEV__) {
      console.log(`[DATA] 🚀 Request: ${name}`, params);
    }
  },
  logResponse: (name: string, response?: any) => {
    if (__DEV__) {
      console.log(`[DATA] ✅ Response: ${name}`, response);
    }
  },
  logError: (name: string, error: any) => {
    if (__DEV__) {
      console.error(`[DATA] ❌ Error in ${name}:`, error);
    }
  },
};
