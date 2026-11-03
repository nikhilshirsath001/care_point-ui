import { ValidatorFn } from '@angular/forms';

export type DynamicFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'date'
  | 'time'
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

  eventType?: 'blur' | 'input' | 'change';
  eventMessage?: string;
  eventMessageType?: 'success' | 'error' | 'info' | 'warning';
}

export interface DynamicFormConfig {
  title?: string;

  submitLabel?: string;
  cancelLabel?: string;
  resetLabel?: string;

  fields: DynamicFormField[];

  showReset?: boolean;

  /**
   * Optional defaults for action buttons.
   * If omitted, existing behavior is preserved.
   */
  showCancel?: boolean;
  showSubmit?: boolean;
}