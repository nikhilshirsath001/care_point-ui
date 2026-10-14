import { Validators } from '@angular/forms';
import { DynamicFormConfig } from '../../../core/models/dynamic-form.model';
import { DetailField } from '../../../shared/shared-details/shared-details.component';
import { PatientSearchConfig } from '../../../shared/patient-search/patient-search.component';


export const INPATIENT_FORM_CONFIG: DynamicFormConfig = {

  title: 'Inpatient Admission',

  submitLabel: 'Save Admission',

  cancelLabel: 'Cancel',

  showReset: true,

  fields: [

    {
      name: 'patientId',
      label: 'Patient',
      type: 'select',
      placeholder: 'Select patient',
      required: true,
      options: [],
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'admissionNo',
      label: 'Admission No',
      type: 'text',
      placeholder: 'Enter admission number',
      required: true,
      validators: [
        Validators.required,
        Validators.maxLength(30)
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'wardId',
      label: 'Ward',
      type: 'select',
      placeholder: 'Select ward',
      required: true,
      options: [],
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'bedId',
      label: 'Bed',
      type: 'select',
      placeholder: 'Select bed',
      required: true,
      options: [],
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'attendingDoctorId',
      label: 'Attending Doctor',
      type: 'select',
      placeholder: 'Select attending doctor',
      required: true,
      options: [],
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'admissionDate',
      label: 'Admission Date',
      type: 'date',
      placeholder: 'Select admission date',
      required: true,
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'admissionType',
      label: 'Admission Type',
      type: 'select',
      placeholder: 'Select admission type',
      required: true,
      options: [
        {
          label: 'Emergency',
          value: 'EMERGENCY'
        },
        {
          label: 'Routine',
          value: 'ROUTINE'
        },
        {
          label: 'Referral',
          value: 'REFERRAL'
        },
        {
          label: 'Transfer',
          value: 'TRANSFER'
        }
      ],
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    },

    {
      name: 'reason',
      label: 'Reason for Admission',
      type: 'textarea',
      placeholder: 'Enter reason for admission',
      required: false,
      validators: [
        Validators.maxLength(500)
      ],
      col: 'col-12'
    },

    {
      name: 'status',
      label: 'Admission Status',
      type: 'select',
      placeholder: 'Select status',
      required: true,
      options: [
        {
          label: 'Admitted',
          value: 'ADMITTED'
        },
        {
          label: 'Under Treatment',
          value: 'UNDER_TREATMENT'
        },
        {
          label: 'Discharge Initiated',
          value: 'DISCHARGE_INITIATED'
        },
        {
          label: 'Discharged',
          value: 'DISCHARGED'
        },
        {
          label: 'Transferred',
          value: 'TRANSFERRED'
        },
        {
          label: 'Cancelled',
          value: 'CANCELLED'
        }
      ],
      validators: [
        Validators.required
      ],
      col: 'col-12 col-md-6'
    }

  ]

};



export const INPATIENT_DETAIL_FIELDS: DetailField[] = [

  {
    field: 'admissionNumber',
    label: 'Admission No'
  },

  {
    field: 'patientName',
    label: 'Patient Name'
  },

  {
    field: 'patientId',
    label: 'Patient No'
  },

  {
    field: 'ward',
    label: 'Ward'
  },

  {
    field: 'bed',
    label: 'Bed'
  },

  {
    field: 'admittingDoctorName',
    label: 'Attending Doctor'
  },

  {
    field: 'admissionDate',
    label: 'Admission Date',
    type: 'date'
  },

  {
    field: 'admissionType',
    label: 'Admission Type'
  },

  {
    field: 'reason',
    label: 'Reason for Admission'
  },

  {
    field: 'status',
    label: 'Status',
    type: 'status'
  }

];

export const ADMISSION_TYPES= [
              { label: 'URGENT', value: 'URGENT' },
              { label: 'TRANSFER', value: 'TRANSFER' },
              { label: 'ROUTINE', value: 'ROUTINE' },
              { label: 'EMERGENCY', value: 'EMERGENCY' },
              { label: 'NEWBORN', value: 'NEWBORN' },
            ];

export const STATUS_LIST =[
              { label: 'ADMITTED', value: 'ADMITTED' },
              { label: 'DISCHARGED', value: 'DISCHARGED' },
              { label: 'TRANSFERRED', value: 'TRANSFERRED' },
            ];

export const  ADMISSION_SEARCH_CONFIG: PatientSearchConfig = {

  searchType: 'admission',

  title: 'Find Inpatient Admission',

  description:
    'Search using Admission ID, Patient ID, patient name or mobile number.',

  placeholder:
    'Enter Admission ID, Patient ID, patient name or mobile number',

  searchButtonLabel: 'Search Admission',

  selectButtonLabel: 'Select Admission',

  entityLabel: 'Admission',

  entityLabelPlural: 'Admissions',

  identityField: 'admissionId',

  displayNameField: 'patientName',

    resultColumns: [

    {
       field: 'admissionNumber',
      header: 'Admission Number',
      type: 'number',
    },
    {
      field: 'patientName',
      header: 'Patient Name',
      type: 'text',
    },

    {
      field: 'admissionDate',
      header: 'Admission Date',
      type: 'datetime',
      format: 'dd/MM/yyyy HH:mm',
    },
    {
      field: 'status',
      header: 'Status',
      type: 'status',
    }
  ]
};

export const TREATMENT_DETAIL_FIELDS: DetailField[] = [
  {
    field: 'procedureCode',
    label: 'Procedure Code'
  },
  {
    field: 'procedureName',
    label: 'Procedure Name'
  },
  {
    field: 'description',
    label: 'Description'
  },
  {
    field: 'treatmentDate',
    label: 'Treatment Date'
  },
  {
    field: 'doctorName',
    label: 'Doctor Name'
  },
  {
    field: 'remarks',
    label: 'Remarks'
  }
];
