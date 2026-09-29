const HMIS_BASE = '/hmis';

export const API_ENDPOINTS = {
  PATIENTS: {
    BASE: HMIS_BASE,
    CREATE: `${HMIS_BASE}/patients`,
    GET_ALL: `${HMIS_BASE}/get`
  }
} as const;