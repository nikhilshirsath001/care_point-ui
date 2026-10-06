const HMIS_BASE = '/hmis';
const MED_BASE = '/medication';

export const API_ENDPOINTS = {
  PATIENTS: {
    BASE: HMIS_BASE,
    CREATE: `${HMIS_BASE}/create`,
    GET_ALL: `${HMIS_BASE}/get`,
    SEARCH: `${HMIS_BASE}/search`,
    UPDATE: `${HMIS_BASE}/update`,
    DELETE: `${HMIS_BASE}/delete`,
    EXISTS: `${HMIS_BASE}/exists`,
  },

  IPD: {
    BASE: `${HMIS_BASE}/admission`,
    GET_ALL: `${HMIS_BASE}/admission/get-all`,
    CREATE: `${HMIS_BASE}/admission/create`,
    GET_PATEINT_WORKSPACE_BY_PATIENT_ID :`${HMIS_BASE}/admission/treatment/patient/`,
    CREATE_TREATMENT :"/procedure/treatment",
    GET_TREATMENTS_BY_ADMISSION_ID:"/procedure/treatment/admission",
    CREATE_PRESCRIPTION:"/medication/prescription"
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
  MEDICATION:{
    BASE:MED_BASE,
    GET_ALL:`${MED_BASE}/medications`,
    PRESCRIPTION:{
      CREATE_PRESCRIPTION:`${MED_BASE}/prescription`,
      PATIENT_PRESCRIPTION :`${MED_BASE}/prescription/patient`
    }
  }
} as const;

const API_NAVIGATION_BASE = '/main';
export const API_NAVIGATION = {
  PATIENTS: {
    BASE: `${API_NAVIGATION_BASE}/patient`,
    CREATE: `${API_NAVIGATION_BASE}/patient/create`,
    LIST: `${API_NAVIGATION_BASE}/patient`,
  },
} as const;
