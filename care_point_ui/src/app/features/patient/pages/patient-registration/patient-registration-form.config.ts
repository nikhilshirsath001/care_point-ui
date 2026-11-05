import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { DynamicFormConfig } from "../../../../core/models/dynamic-form.model";



const MOBILE_PATTERN = /^\+?[0-9]{10,15}$/;
const ABHA_PATTERN = /^[0-9]{14}$/;
const PINCODE_PATTERN = /^[0-9]{6}$/;


export function toIsoDate(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    if (isNaN(value.getTime())) {
      return null;
    }
    const mm = String(value.getMonth() + 1).padStart(2, '0');
    const dd = String(value.getDate()).padStart(2, '0');
    return `${value.getFullYear()}-${mm}-${dd}`;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    return /^\d{4}-\d{2}-\d{2}/.test(trimmed) ? trimmed.substring(0, 10) : null;
  }

  return null;
}

function todayIso(): string {
  return toIsoDate(new Date()) as string;
}

const notFutureDate: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  const value = toIsoDate(control.value);
  return value && value > todayIso() ? { futureDate: true } : null;
};


export const patientFieldsConfig: DynamicFormConfig = {
    title: 'Patient Information',
    fields: [
      {
        name: 'abhaNumber',
        label: 'ABHA Number',
        type: 'text',
        placeholder: 'Enter 14-digit ABHA number',
        required: true,
        col: 'col-12 col-md-6',
        validators: [Validators.required, Validators.pattern(ABHA_PATTERN)],
      },
      {
        name: 'patientName',
        label: 'Patient Full Name',
        type: 'text',
        placeholder: 'Enter patient full name',
        required: true,
        col: 'col-12 col-md-6',
        validators: [Validators.required, Validators.maxLength(200)],
      },
      {
        name: 'patientDob',
        label: 'Date of Birth',
        required: true,
        type: 'date',
        col: 'col-12 col-md-6',
        validators: [Validators.required, notFutureDate],
      },
      {
        name: 'patientMob',
        label: 'Mobile Number',
        type: 'text',
        placeholder: 'Enter mobile number',
        required: true,
        col: 'col-12 col-md-6',
        validators: [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(MOBILE_PATTERN),
        ],
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        placeholder: 'Select gender',
        required: true,
        col: 'col-12 col-md-6',
        options: [
          { label: 'Male', value: 'MALE' },
          { label: 'Female', value: 'FEMALE' },
          { label: 'Other', value: 'OTHER' },
        ],
        validators: [Validators.required],
      },
      {
        name: 'relation',
        label: 'Relation',
        type: 'select',
        placeholder: 'Select relation',
        required: true,
        col: 'col-12 col-md-6',
        options: [
          { label: 'Self', value: 'SELF' },
          { label: 'Father', value: 'FATHER' },
          { label: 'Mother', value: 'MOTHER' },
          { label: 'Husband', value: 'HUSBAND' },
          { label: 'Wife', value: 'WIFE' },
          { label: 'Son', value: 'SON' },
          { label: 'Daughter', value: 'DAUGHTER' },
          { label: 'Brother', value: 'BROTHER' },
          { label: 'Sister', value: 'SISTER' },
          { label: 'Grandfather', value: 'GRANDFATHER' },
          { label: 'Grandmother', value: 'GRANDMOTHER' },
          { label: 'Uncle', value: 'UNCLE' },
          { label: 'Aunt', value: 'AUNT' },
          { label: 'Guardian', value: 'GUARDIAN' },
          { label: 'Other', value: 'OTHER' },
        ],
        validators: [Validators.required],
      },
      {
        name: 'isChildRegistration',
        label: 'Child Registration',
        type: 'checkbox',
        col: 'col-12 col-md-6',
        defaultValue: false,
        validators: [],
      },
      {
        name: 'isCommAddressSameAsCardAddress',
        label: 'Communication Address Same As Permanent Address',
        type: 'checkbox',
        defaultValue: true,
        validators: [],
      },
    ],
  };

export const addressFieldsConfig: DynamicFormConfig = {
    fields: [
      {
        name: 'address',
        label: 'Address',
        type: 'textarea',
        required: true,
        placeholder: 'House number, street, locality',
        col: 'col-12',
        validators: [Validators.required],
      },
      {
        name: 'villageTownCity',
        label: 'Village / Town / City',
        type: 'text',
        placeholder: 'Enter village, town or city',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'district',
        label: 'District',
        type: 'text',
        placeholder: 'Enter district',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'state',
        label: 'State',
        type: 'text',
        placeholder: 'Enter state',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'pincode',
        label: 'PIN Code',
        type: 'text',
        placeholder: 'Enter 6-digit PIN code',
        col: 'col-12 col-md-6',
        validators: [Validators.pattern(PINCODE_PATTERN)],
      },
    ],
  };

export const contactPersonFieldsConfig: DynamicFormConfig = {
    fields: [
      {
        name: 'name',
        label: 'Contact Person Name',
        type: 'text',
        required: true,
        placeholder: 'Enter full name',
        col: 'col-12 col-md-6',
        validators: [Validators.required],
      },
      {
        name: 'relationDescription',
        label: 'Relationship Description',
        type: 'text',
        placeholder: 'Example: Father, Brother',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'relationCode',
        label: 'Relationship Code',
        type: 'text',
        placeholder: 'Enter relationship code',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'relationUrl',
        label: 'Relationship URL',
        type: 'text',
        placeholder: 'Enter relationship URL',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'address',
        label: 'Contact Person Address',
        type: 'textarea',
        placeholder: 'Enter address',
        col: 'col-12',
        validators: [],
      },
      {
        name: 'mobileNumber',
        label: 'Contact Person Mobile',
        type: 'text',
        required: true,
        placeholder: 'Enter mobile number',
        col: 'col-12 col-md-6',
        validators: [Validators.pattern(MOBILE_PATTERN), Validators.required],
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        required: true,
        placeholder: 'Select gender',
        col: 'col-12 col-md-6',
        options: [
          { label: 'Male', value: 'MALE' },
          { label: 'Female', value: 'FEMALE' },
          { label: 'Other', value: 'OTHER' },
        ],
        validators: [Validators.required],
      },
    ],
  };

export const subscriberFieldsConfig: DynamicFormConfig = {
    fields: [
      {
        name: 'abhaNumber',
        label: 'Subscriber ABHA Number',
        type: 'text',
        placeholder: 'Enter ABHA number',
        col: 'col-12 col-md-6',
        validators: [Validators.pattern(ABHA_PATTERN)],
      },
      {
        name: 'name',
        label: 'Subscriber Name',
        type: 'text',
        placeholder: 'Enter subscriber name',
        required: true,
        col: 'col-12 col-md-6',
        validators: [Validators.required],
      },
      {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        placeholder: 'Select gender',
        col: 'col-12 col-md-6',
        options: [
          { label: 'Male', value: 'MALE' },
          { label: 'Female', value: 'FEMALE' },
          { label: 'Other', value: 'OTHER' },
        ],
        validators: [],
      },
      {
        name: 'mob',
        label: 'Mobile Number',
        type: 'text',
        placeholder: 'Enter mobile number',
        col: 'col-12 col-md-6',
        validators: [Validators.pattern(MOBILE_PATTERN)],
      },
      {
        name: 'dob',
        label: 'Date of Birth',
        type: 'date',
        col: 'col-12 col-md-6',
        validators: [notFutureDate],
      },
      {
        name: 'subscriberId',
        label: 'Subscriber ID',
        type: 'text',
        placeholder: 'Enter subscriber ID',
        col: 'col-12 col-md-6',
        validators: [],
      },
    ],
  };

export const insuranceFieldsConfig: DynamicFormConfig = {
    title: 'Patient Insurance Policy',
    fields: [
      {
        name: 'insurancePolicyType',
        label: 'Insurance Policy Type',
        type: 'select',
        placeholder: 'Select policy type',
        col: 'col-12 col-md-6',
        options: [
          { label: 'Individual', value: 'INDIVIDUAL' },
          { label: 'Family Floater', value: 'FAMILY_FLOATER' },
          { label: 'Corporate', value: 'CORPORATE' },
          { label: 'Government', value: 'GOVERNMENT' },
          { label: 'Other', value: 'OTHER' },
        ],
        validators: [],
      },
      {
        name: 'insuranceCompanyName',
        label: 'Insurance Company Name',
        type: 'text',
        placeholder: 'Enter insurance company',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'policyNumber',
        label: 'Policy Number',
        type: 'text',
        placeholder: 'Enter policy number',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'memberId',
        label: 'Member ID',
        type: 'text',
        placeholder: 'Enter member ID',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'insuranceProviderNumber',
        label: 'Insurance Provider Number',
        type: 'text',
        placeholder: 'Enter provider number',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'recipientCode',
        label: 'Recipient Code',
        type: 'text',
        placeholder: 'Enter recipient code',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'policyStartDate',
        label: 'Policy Start Date',
        type: 'date',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'policyEndDate',
        label: 'Policy End Date',
        type: 'date',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'insuranceBenefitStartDate',
        label: 'Insurance Benefit Start Date',
        type: 'date',
        col: 'col-12 col-md-6',
        validators: [],
      },
      {
        name: 'insuranceBenefitEndDate',
        label: 'Insurance Benefit End Date',
        type: 'date',
        col: 'col-12 col-md-6',
        validators: [],
      },
    ],
  };

