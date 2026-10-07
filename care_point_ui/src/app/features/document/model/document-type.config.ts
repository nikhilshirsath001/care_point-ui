import { DocumentTypeOption } from "./document-model";

export const DOCUMENT_TYPES: DocumentTypeOption[] = [
  { label: 'All Categories', value: '' },
  { label: 'Photo', value: 'PHOTO' },
  { label: 'Pan', value: 'PAN' },
  { label: 'Aadhaar', value: 'AADHAAR' },
  { label: 'Passport', value: 'PASSPORT' },
  { label: 'Driving License', value: 'DRIVING_LICENSE' },
  { label: 'Voter Id', value: 'VOTER_ID' },
  { label: 'Insurance', value: 'INSURANCE' },
  { label: 'Medical Report', value: 'MEDICAL_REPORT' },
  { label: 'Prescription', value: 'PRESCRIPTION' },
  { label: 'Discharge Summary', value: 'DISCHARGE_SUMMARY' },
  { label: 'Lab Report', value: 'LAB_REPORT' },
  { label: 'Other', value: 'OTHER' }
];

export const DOCUMENT_DATE_OPTIONS = [
    {
      label: 'All Dates',
      value: null
    },
    {
      label: 'Today',
      value: 'today'
    },
    {
      label: 'Last 7 Days',
      value: '7days'
    },
    {
      label: 'Last 30 Days',
      value: '30days'
    }
  ];


export const DOCUMENT_SORT_OPTIONS = [
    {
      label: 'Newest First',
      value: 'newest'
    },
    {
      label: 'Oldest First',
      value: 'oldest'
    },
    {
      label: 'Name A-Z',
      value: 'nameAsc'
    },
    {
      label: 'Name Z-A',
      value: 'nameDesc'
    },
    {
      label: 'Largest First',
      value: 'sizeDesc'
    },
    {
      label: 'Smallest First',
      value: 'sizeAsc'
    }
  ];