import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { DynamicFormComponent } from '../../../../shared/dynamic-form/dynamic-form.component';

import { DynamicFormConfig } from '../../../../core/models/dynamic-form.model';
import { UserModel } from '../../models/user.model';
import { USER_FORM_CONFIG } from '../../config/user-form.config';
import { AdministratorService } from '../../services/administrator.service';


@Component({
  selector: 'app-user-form',

  standalone: true,

  imports: [DynamicFormComponent],

  templateUrl: './user-form.component.html',

  styleUrl: './user-form.component.css',
})
export class UserFormComponent implements OnChanges {
  // ========================================================
  // INPUTS
  // ========================================================

  @Input()
  mode: 'create' | 'edit' = 'create';

  @Input()
  user: UserModel | null = null;

  // ========================================================
  // OUTPUTS
  // ========================================================

  @Output()
  saved = new EventEmitter<void>();

  @Output()
  cancelled = new EventEmitter<void>();

  // ========================================================
  // FORM CONFIG
  // ========================================================

  formConfig: DynamicFormConfig = USER_FORM_CONFIG;

  // ========================================================
  // LOADING
  // ========================================================

  loading = false;

  // ========================================================
  // FORM DATA
  // ========================================================

  formData: Record<string, any> = {};

  constructor(private administratorService: AdministratorService) {}

  // ========================================================
  // INPUT CHANGES
  // ========================================================

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['user']) {
      this.prepareForm();
    }
  }

  // ========================================================
  // PREPARE FORM
  // ========================================================

  private prepareForm(): void {
    if (this.mode === 'edit' && this.user) {
      this.formData = {
        username: this.user.username ?? '',

        active: this.user.active ?? true,
      };
    } else {
      this.formData = {
        username: '',

        email: '',

        role: '',

        active: true,
      };
    }
  }

  // ========================================================
  // SUBMIT
  // ========================================================

  onSubmit(formData: Record<string, any>): void {
    console.log('USER FORM SUBMITTED:', formData);

    const request = {
      username: formData['username'],

      email: formData['email'],

      role: formData['role'],

      active: formData['active'] ?? true,
    };

    this.loading = true;

    if (this.mode === 'create') {
      this.createUser(request);
    } else {
      this.updateUser(request);
    }
  }

  // ========================================================
  // CREATE
  // ========================================================

  private createUser(request: any): void {
    this.administratorService.createUser(request).subscribe({
      next: (response: any) => {
        console.log('CREATE USER RESPONSE:', response);

        this.loading = false;

        this.saved.emit();
      },

      error: (error: any) => {
        console.error('CREATE USER ERROR:', error);

        this.loading = false;
      },
    });
  }

  // ========================================================
  // UPDATE
  // ========================================================

  private updateUser(request: any): void {
    const userId = this.user?.userId;

    if (userId === undefined || userId === null) {
      console.error('User ID is missing. Cannot update user.');

      this.loading = false;

      return;
    }

    this.administratorService.updateUser(userId, request).subscribe({
      next: (response: any) => {
        console.log('UPDATE USER RESPONSE:', response);

        this.loading = false;

        this.saved.emit();
      },

      error: (error: any) => {
        console.error('UPDATE USER ERROR:', error);

        this.loading = false;
      },
    });
  }

  // ========================================================
  // CANCEL
  // ========================================================

  onCancel(): void {
    this.cancelled.emit();
  }
}
