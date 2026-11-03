import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';

import {
  DynamicFormConfig,
  DynamicFormField
} from '../../core/models/dynamic-form.model';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    SelectModule,
    MultiSelectModule,
    TextareaModule,
    CheckboxModule,
    RadioButtonModule,
    ButtonModule
  ],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.css'
})
export class DynamicFormComponent implements OnChanges, OnDestroy {

  // --------------------------------------------------
  // INPUTS
  // --------------------------------------------------

  @Input() config!: DynamicFormConfig;

  @Input() data: Record<string, any> | null = null;

  @Input() loading = false;

  @Input() mode: 'create' | 'edit' = 'create';

  /**
   * Controls the entire action-button section.
   *
   * Default: true, preserving existing behavior.
   *
   * Set false when the parent component manages
   * its own buttons, such as a multi-step form.
   */
  @Input() showActions = true;

  /**
   * null means use config.showReset.
   * Existing behavior is preserved by default.
   */
  @Input() showResetButton: boolean | null = null;

  /**
   * null means use config.showCancel when provided.
   */
  @Input() showCancelButton: boolean | null = null;

  /**
   * null means use config.showSubmit when provided.
   */
  @Input() showSubmitButton: boolean | null = null;

  // --------------------------------------------------
  // OUTPUTS
  // --------------------------------------------------

  /**
   * Existing output: emits form values on submission.
   */
  @Output() submitted =
    new EventEmitter<Record<string, any>>();

  /**
   * Existing output: emits when Cancel is clicked.
   */
  @Output() cancelled = new EventEmitter<void>();

  /**
   * Existing output: emits when Reset is clicked.
   */
  @Output() reset = new EventEmitter<void>();

  /**
   * Existing output: emits configured field events.
   */
  @Output() fieldEvent = new EventEmitter<{
    fieldName: string;
    eventType: string;
    value: any;
  }>();

  /**
   * New output: provides access to the built FormGroup.
   *
   * The parent can use this to coordinate validation
   * and navigation across multiple form steps.
   */
  @Output() formReady = new EventEmitter<FormGroup>();

  /**
   * New output: emits current form values whenever
   * the form changes.
   */
  @Output() valueChanged =
    new EventEmitter<Record<string, any>>();

  // --------------------------------------------------
  // FORM STATE
  // --------------------------------------------------

  form!: FormGroup;

  private formChangesSubscription?: Subscription;

  constructor(
    private fb: FormBuilder
  ) {}

  // --------------------------------------------------
  // INPUT CHANGE HANDLING
  // --------------------------------------------------

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['config'] && this.config) {
      this.buildForm();
      return;
    }

    /*
     * Update existing controls when the parent supplies
     * new data. Do not rebuild the form unnecessarily.
     */
    if (
      changes['data'] &&
      this.form &&
      this.config
    ) {
      this.updateFormData();
    }
  }

  ngOnDestroy(): void {
    this.formChangesSubscription?.unsubscribe();
  }

  // --------------------------------------------------
  // FORM CREATION
  // --------------------------------------------------

  private buildForm(): void {

    if (!this.config) {
      return;
    }

    this.formChangesSubscription?.unsubscribe();

    const controls: Record<string, FormControl> = {};

    this.config.fields.forEach(field => {

      const value = this.getInitialValue(field);

      controls[field.name] = new FormControl(
        {
          value,
          disabled: field.disabled ?? false
        },
        field.validators ?? []
      );

    });

    this.form = this.fb.group(controls);

    this.subscribeToFormChanges();

    /*
     * Notify the parent that the form is available.
     */
    this.formReady.emit(this.form);
  }

  private getInitialValue(
    field: DynamicFormField
  ): any {

    const dataValue = this.data?.[field.name];

    if (dataValue !== undefined && dataValue !== null) {
      return dataValue;
    }

    if (field.defaultValue !== undefined) {
      return field.defaultValue;
    }

    return this.getDefaultValue(field);
  }

  private getDefaultValue(
    field: DynamicFormField
  ): any {

    switch (field.type) {

      case 'checkbox':
        return false;

      case 'multiselect':
        return [];

      default:
        return null;
    }
  }

  // --------------------------------------------------
  // DATA UPDATES
  // --------------------------------------------------

  private updateFormData(): void {

    if (!this.form || !this.config) {
      return;
    }

    const updatedValues: Record<string, any> = {};

    this.config.fields.forEach(field => {
      updatedValues[field.name] =
        this.getInitialValue(field);
    });

    /*
     * Keep the existing FormGroup instance.
     * emitEvent:false prevents a data refresh from
     * being mistaken for a user's form edit.
     */
    this.form.patchValue(
      updatedValues,
      { emitEvent: false }
    );

    this.form.markAsPristine();
    this.form.markAsUntouched();

    this.formReady.emit(this.form);
  }

  /**
   * Allows a parent component to update form values
   * without changing the config reference.
   */
  setData(
    data: Record<string, any>,
    emitEvent = false
  ): void {

    if (!this.form || !this.config) {
      return;
    }

    this.data = data;

    const updatedValues: Record<string, any> = {};

    this.config.fields.forEach(field => {
      updatedValues[field.name] =
        this.getInitialValue(field);
    });

    this.form.patchValue(
      updatedValues,
      { emitEvent }
    );
  }

  // --------------------------------------------------
  // FORM CHANGE EVENTS
  // --------------------------------------------------

  private subscribeToFormChanges(): void {

    this.formChangesSubscription?.unsubscribe();

    this.formChangesSubscription =
      this.form.valueChanges.subscribe(() => {

        /*
         * Use getRawValue so disabled fields are
         * included in the emitted data.
         */
        this.valueChanged.emit(
          this.form.getRawValue()
        );

      });
  }

  // --------------------------------------------------
  // FIELD HELPERS
  // --------------------------------------------------

  isVisible(field: DynamicFormField): boolean {
    return field.hidden !== true;
  }

  getControl(name: string): FormControl {

    return this.form.get(name) as FormControl;
  }

  // --------------------------------------------------
  // BUTTON VISIBILITY
  // --------------------------------------------------

  get shouldShowReset(): boolean {

    if (this.showResetButton !== null) {
      return this.showResetButton;
    }

    return this.config?.showReset !== false;
  }

  get shouldShowCancel(): boolean {

    if (this.showCancelButton !== null) {
      return this.showCancelButton;
    }

    return this.config?.showCancel !== false;
  }

  get shouldShowSubmit(): boolean {

    if (this.showSubmitButton !== null) {
      return this.showSubmitButton;
    }

    return this.config?.showSubmit !== false;
  }

  // --------------------------------------------------
  // FORM SUBMISSION
  // --------------------------------------------------

  submit(): void {

    if (!this.form) {
      return;
    }

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;
    }

    this.submitted.emit(
      this.form.getRawValue()
    );
  }

  cancel(): void {
    this.cancelled.emit();
  }

  // --------------------------------------------------
  // RESET
  // --------------------------------------------------

  resetForm(): void {

    if (!this.form || !this.config) {
      return;
    }

    const resetValues: Record<string, any> = {};

    this.config.fields.forEach(field => {

      resetValues[field.name] =
        field.defaultValue !== undefined
          ? field.defaultValue
          : this.getDefaultValue(field);

    });

    this.form.reset(resetValues);

    this.form.markAsPristine();
    this.form.markAsUntouched();

    this.reset.emit();
  }

  // --------------------------------------------------
  // FIELD EVENTS
  // --------------------------------------------------

  onFieldEvent(
    field: DynamicFormField,
    eventType: string,
    event: Event
  ): void {

    if (field.eventType !== eventType) {
      return;
    }

    const target = event.target as HTMLInputElement;

    const value = target?.value;

    this.fieldEvent.emit({
      fieldName: field.name,
      eventType,
      value
    });
  }

  // --------------------------------------------------
  // CUSTOM VALIDATION ERRORS
  // --------------------------------------------------

  setFieldError(
    fieldName: string,
    errorKey: string,
    message: string
  ): void {

    const control = this.form?.get(fieldName);

    if (!control) {
      return;
    }

    control.setErrors({
      ...(control.errors || {}),
      [errorKey]: message
    });

    control.markAsTouched();
  }

  clearFieldError(
    fieldName: string,
    errorKey: string
  ): void {

    const control = this.form?.get(fieldName);

    if (!control?.errors?.[errorKey]) {
      return;
    }

    const errors = { ...control.errors };

    delete errors[errorKey];

    control.setErrors(
      Object.keys(errors).length
        ? errors
        : null
    );
  }

  // --------------------------------------------------
  // VALIDATION MESSAGES
  // --------------------------------------------------

  getValidationMessage(
    field: DynamicFormField
  ): string {

    const control = this.form?.get(field.name);

    if (!control?.errors) {
      return '';
    }

    if (control.hasError('required')) {
      return `${field.label} is required.`;
    }

    if (control.hasError('exists')) {
      return control.getError('exists');
    }

    if (control.hasError('minlength')) {
      return `${field.label} is too short.`;
    }

    if (control.hasError('maxlength')) {
      return `${field.label} is too long.`;
    }

    if (control.hasError('email')) {
      return 'Please enter a valid email address.';
    }

    if (control.hasError('pattern')) {
      return `${field.label} has an invalid format.`;
    }

    if (control.hasError('min')) {
      return `${field.label} is below the minimum value.`;
    }

    if (control.hasError('max')) {
      return `${field.label} exceeds the maximum value.`;
    }

    return `${field.label} is invalid.`;
  }
}