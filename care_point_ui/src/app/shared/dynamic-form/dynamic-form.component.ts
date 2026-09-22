import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
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

import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { DynamicFormConfig, DynamicFormField } from '../../core/models/dynamic-form.model';

@Component({
  selector: 'app-dynamic-form',
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
export class DynamicFormComponent implements OnChanges {

  @Input() config!: DynamicFormConfig;

  @Input() data: Record<string, any> | null = null;

  @Input() loading = false;

  @Input() mode: 'create' | 'edit' = 'create';

  @Output() submitted = new EventEmitter<Record<string, any>>();

  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges): void {

    if (changes['config'] || changes['data']) {
      this.buildForm();
    }
  }

  private buildForm(): void {

    if (!this.config) {
      return;
    }

    const controls: Record<string, FormControl> = {};

    this.config.fields.forEach(field => {

      const value =
        this.data?.[field.name] ??
        field.defaultValue ??
        this.getDefaultValue(field);

      controls[field.name] = new FormControl(
        {
          value,
          disabled: field.disabled ?? false
        },
        field.validators ?? []
      );
    });

    this.form = this.fb.group(controls);
  }

  private getDefaultValue(field: DynamicFormField): any {

    switch (field.type) {

      case 'checkbox':
        return false;

      case 'multiselect':
        return [];

      default:
        return null;
    }
  }

  isVisible(field: DynamicFormField): boolean {

    if (field.hidden === true) {
      return false;
    }

    return true;
  }

  getControl(name: string): FormControl {

    return this.form.get(name) as FormControl;
  }

  submit(): void {

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

  reset(): void {

    this.buildForm();
  }
}