import { mockApi } from './mockApi';
import { realApi } from './realApi';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true' || import.meta.env.VITE_USE_MOCKS === true;

export const api = USE_MOCKS ? mockApi : realApi;

export { mockApi, realApi, USE_MOCKS };
