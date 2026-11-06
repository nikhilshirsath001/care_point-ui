  import {
    TableColumn,
    SharedTableConfig
  } from '../../../shared/shared-table/shared-table.component';

  export const CLINICAL_RECORD_COLUMNS: TableColumn[] = [
    
  {
    field: 'recordDate',
    header: 'Record Date',
    type: 'date',
    sortable: true
  },
  {
    field: 'visitId',
    header: 'Visit ID',
    type: 'text',
    sortable: true
  },
  {
    field: 'doctorName',
    header: 'Doctor Name',
    type: 'text',
    sortable: true
  },
  {
    field: 'diagnosisName',
    header: 'Diagnosis',
    type: 'text',
    sortable: true
  },
  {
    field: 'symptoms',
    header: 'Symptoms',
    type: 'text'
  },
  {
    field: 'treatment',
    header: 'Treatment',
    type: 'text'
  },
  {
    field: 'notes',
    header: 'Notes',
    type: 'text'
  }
];


  export const DIAGNOSIS_COLUMNS: TableColumn[] = [
   {
    field: 'visitId',
    header: 'Visit ID',
    type: 'text',
    sortable: true
  },
   
    {
      field: 'diagnosisCode',
      header: 'Code',
      type: 'text',
      sortable: true
    },
    {
      field: 'diagnosisName',
      header: 'Diagnosis',
      type: 'text',
      sortable: true
    },
    {
      field: 'description',
      header: 'Description',
      type: 'text'
    },
    {
      field: 'active',
      header: 'Status',
      type: 'status'
    }
  ];

  export const PROCEDURE_COLUMNS: TableColumn[] = [
  
    {
    field: 'visitId',
    header: 'Visit ID',
    type: 'text',
    sortable: true
  },
  
    {
      field: 'procedureCode',
      header: 'Code',
      type: 'text',
      sortable: true
    },
    {
      field: 'procedureName',
      header: 'Procedure',
      type: 'text',
      sortable: true
    },
    {
      field: 'description',
      header: 'Description',
      type: 'text'
    }
  ];

  export const MEDICATION_COLUMNS: TableColumn[] = [
    {
      field: 'prescriptionDate',
      header: 'Prescription Date',
      type: 'date',
      sortable: true
    },
    {
      field: 'medicationName',
      header: 'Medication',
      type: 'text',
      sortable: true
    },
    {
      field: 'genericName',
      header: 'Generic Name',
      type: 'text'
    },
    {
      field: 'strength',
      header: 'Strength',
      type: 'text'
    },
    {
      field: 'dosage',
      header: 'Dosage',
      type: 'text'
    },
    {
      field: 'frequency',
      header: 'Frequency',
      type: 'text'
    },
    {
      field: 'duration',
      header: 'Duration',
      type: 'text'
    },
    {
      field: 'instructions',
      header: 'Instructions',
      type: 'text'
    }
  ];

  export const EMR_TABLE_CONFIG: SharedTableConfig = {
    searchable: true,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [10, 20, 50],
    exportable: true,
    showRefresh: true,
    loading: false,
    emptyMessage: 'No records found'
  };
