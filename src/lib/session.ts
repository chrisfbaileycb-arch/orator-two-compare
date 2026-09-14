import { InquestState } from './types';

const STORAGE_KEYS = {
  INQUEST: 'forge_inquest_state',
  CHARTER_SIGNED: 'forge_charter_signed',
  USER_ID: 'forge_user_session_id',
  AUDIT_LOGS: 'forge_audit_logs',
};

export const getSessionId = (): string => {
  let id = localStorage.getItem(STORAGE_KEYS.USER_ID);
  if (!id) {
    id = 'FRG-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    localStorage.setItem(STORAGE_KEYS.USER_ID, id);
  }
  return id;
};

export const loadInquestState = (): InquestState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INQUEST);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse saved inquest state:', e);
    return null;
  }
};

export const saveInquestState = (state: InquestState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.INQUEST, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save inquest state:', e);
  }
};

export const isCharterSigned = (): boolean => {
  return localStorage.getItem(STORAGE_KEYS.CHARTER_SIGNED) === 'true';
};

export const setCharterSigned = (signed: boolean): void => {
  localStorage.setItem(STORAGE_KEYS.CHARTER_SIGNED, signed ? 'true' : 'false');
};

export const resetSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.INQUEST);
  localStorage.removeItem(STORAGE_KEYS.CHARTER_SIGNED);
};
