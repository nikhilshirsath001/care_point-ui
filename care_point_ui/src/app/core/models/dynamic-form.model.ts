import { ValidatorFn } from '@angular/forms';

export type DynamicFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'date'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio';

export interface DynamicFormOption {
  label: string;
  value: any;
}

export interface DynamicFormField {
  name: string;
  label: string;

  type: DynamicFieldType;

  placeholder?: string;

  required?: boolean;

  disabled?: boolean;

  defaultValue?: any;

  options?: DynamicFormOption[];

  validators?: ValidatorFn[];

  col?: string;

  helpText?: string;

  hidden?: boolean;

  readonly?: boolean;
}

export interface DynamicFormConfig {
  title?: string;

  submitLabel?: string;

  cancelLabel?: string;

  fields: DynamicFormField[];

  showReset?: boolean;
}