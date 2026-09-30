const HMIS_BASE = '/hmis';

export const API_ENDPOINTS = {
  PATIENTS: {
    BASE: HMIS_BASE,
    CREATE: `${HMIS_BASE}/patients`,
    GET_ALL: `${HMIS_BASE}/get`,
    SEARCH: `${HMIS_BASE}/search`,
  },

  IPD: {
    BASE: `${HMIS_BASE}/admission`,
    GET_ALL: `${HMIS_BASE}/admission/get-all`,
    CREATE: `${HMIS_BASE}/admission/create`,
  },

  BED_WARD: {
    BASE: HMIS_BASE,
    GET_ALL_WARDS: `${HMIS_BASE}/ward/get-all`,
    GET_ROOMS_BY_WARD_ID: `${HMIS_BASE}/wardroom/get-by-ward-id`,
    GET_AVAILABLE_BEDS_BY_ROOM_ID: `${HMIS_BASE}/bed/avaialble/get-by-roomId`,
    ASSIGN_BED: `${HMIS_BASE}/bed-assignment/create`,
  },

  DEPARTMENTS: {
    BASE: '/departments',
    GET_ALL: '/departments',
    CREATE: '/departments',
  },

  STAFF: {
    BASE: '/staff',
    GET_ALL: '/staff',
    CREATE: '/staff',
  },
} as const;
