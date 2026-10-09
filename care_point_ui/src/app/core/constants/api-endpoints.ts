const HMIS_BASE = '/hmis';
const MED_BASE = '/medication';
const USER_BASE = '/users';
const ROLE_BASE = '/roles';

export const API_ENDPOINTS = {
  PATIENTS: {
    BASE: HMIS_BASE,
    CREATE: `${HMIS_BASE}/create`,
    GET_ALL: `${HMIS_BASE}/get`,
    SEARCH: `${HMIS_BASE}/patient/search`,
    UPDATE: `${HMIS_BASE}/update`,
    DELETE: `${HMIS_BASE}/delete`,
    EXISTS: `${HMIS_BASE}/exists`,
  },

  IPD: {
    BASE: `${HMIS_BASE}/admission`,
    GET_ALL: `${HMIS_BASE}/admission/get-all`,
    CREATE: `${HMIS_BASE}/admission/create`,
    SEARCH: `${HMIS_BASE}/admission/search`,
    GET_PATEINT_WORKSPACE_BY_PATIENT_ID: `${HMIS_BASE}/admission/treatment/`,
    CREATE_TREATMENT: '/procedure/treatment',
    GET_TREATMENTS_BY_ADMISSION_ID: '/procedure/treatment/admission',
    CREATE_PRESCRIPTION: '/medication/prescription',
  },

  BED_WARD: {
    BASE: HMIS_BASE,
    GET_ALL_WARDS: `${HMIS_BASE}/ward/get-all`,
    GET_ALL_FLOOR: `${HMIS_BASE}/floor/get-all`,
    GET_ALL_BEDS: `${HMIS_BASE}/bed/get-all`,
    GET_ALL_ROOMS: `${HMIS_BASE}/wardroom/get-all`,

    DELETE_WARD: `${HMIS_BASE}/ward/delete`,
    DELETE_FLOOR: `${HMIS_BASE}/floor/delete`,
    DELETE_BED: `${HMIS_BASE}/bed/delete`,
    DELETE_ROOM: `${HMIS_BASE}/wardroom/delete`,

    UPDATE_WARD: `${HMIS_BASE}/ward/update`,
    UPDATE_FLOOR: `${HMIS_BASE}/floor/update`,
    UPDATE_BED: `${HMIS_BASE}/bed/update`,
    UPDATE_ROOM: `${HMIS_BASE}/wardroom/update`,

    CREATE_WARD: `${HMIS_BASE}/ward/create`,
    CREATE_ROOM: `${HMIS_BASE}/wardroom/create`,
    CREATE_BED: `${HMIS_BASE}/bed/create`,
    CREATE_FLOOR: `${HMIS_BASE}/floor/create`,

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

  PROCEDURE: {
    BASE: '/procedure',
    GET_ALL: '/procedure/procedure',
    CREATE: '/procedure/procedure',
  },
  DIAGNOSIS: {
    BASE: '/diagnosis',
    GET_ALL: '/diagnosis/diagnosis',
    CREATE: '/diagnosis/diagnosis',
  },
  SERVICE: {
    BASE: '/services',
    SERVICE: {
      GET_ALL: '/services/service',
      CREATE: '/services/service',
    },
    SERVICE_CATEGORY: {
      GET_ALL: '/services/service/service-category',
      CREATE: '/services/service/service-category',
    },
  },
  MEDICATION: {
    BASE: MED_BASE,
    GET_ALL: `${MED_BASE}/medications`,
    CREATE: `${MED_BASE}/medications`,
    DELETE: `${MED_BASE}/medications`,
    UPDATE: `${MED_BASE}/medications`,
    PRESCRIPTION: {
      CREATE_PRESCRIPTION: `${MED_BASE}/prescription`,
      PATIENT_PRESCRIPTION: `${MED_BASE}/prescription/patient`,
      ADMISSION_PRESCRIPTION: `${MED_BASE}/prescription/admission`,
    },
  },

  DOCUMENT: {
    UPLOAD: `/documents`,
    UPLOAD_ALL: `/documents/files`,
    GET_ALL_BY_PATIENT_ID: `/documents`,
    DOWNLOAD: '/documents/:id/download',
    GET_DOC_TYPES: '/documents/doctypes',
  },

  USER: {
    BASE: USER_BASE,
    GET_ALL: `${USER_BASE}`,
    CREATE: `${USER_BASE}`,
    UPDATE: `${USER_BASE}`,
    DELETE: `${USER_BASE}`,
  },
  ROLE: {
    BASE: ROLE_BASE,
    GET_ALL: `${ROLE_BASE}`,
    CREATE: `${ROLE_BASE}`,
    UPDATE: `${ROLE_BASE}`,
    DELETE: `${ROLE_BASE}`,
  },
} as const;

const API_NAVIGATION_BASE = '/main';
export const API_NAVIGATION = {
  PATIENTS: {
    BASE: `${API_NAVIGATION_BASE}/patient`,
    CREATE: `${API_NAVIGATION_BASE}/patient/create`,
    LIST: `${API_NAVIGATION_BASE}/patient`,
  },
} as const;
