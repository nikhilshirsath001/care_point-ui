import { Component, inject, signal } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  SharedTableComponent,
  SharedTableConfig,
} from '../../../../shared/shared-table/shared-table.component';

import { SharedDetailsComponent } from '../../../../shared/shared-details/shared-details.component';

import { DialogModule } from 'primeng/dialog';

import { UserFormComponent } from '../../components/user-form/user-form.component';
import { AdministratorService } from '../../services/administrator.service';
import {
  USER_COLUMNS,
  USER_TABLE_CONFIG,
} from '../../config/user-table.config';
import { UserModel } from '../../models/user.model';
import { USER_DETAILS_FIELD } from '../../config/user-form.config';

@Component({
  selector: 'app-user',

  standalone: true,

  imports: [
    CommonModule,
    SharedTableComponent,
    SharedDetailsComponent,
    DialogModule,
    UserFormComponent,
  ],

  templateUrl: './user.component.html',

  styleUrl: './user.component.css',
})
export class UserComponent {
  // ========================================================
  // DEPENDENCIES
  // ========================================================

  private readonly administratorService = inject(AdministratorService);

  // ========================================================
  // TABLE CONFIGURATION
  // ========================================================

  userColumns = USER_COLUMNS;

  tableConfig: SharedTableConfig = USER_TABLE_CONFIG;

  // ========================================================
  // DATA
  // ========================================================

  users = signal<UserModel[]>([]);

  filteredUsers = signal<UserModel[]>([]);

  totalRecords = signal(0);

  // ========================================================
  // PAGINATION
  // ========================================================

  currentPage = 0;

  currentPageSize = 10;

  // ========================================================
  // FORM
  // ========================================================

  showForm = false;

  formMode: 'create' | 'edit' = 'create';

  // ========================================================
  // SELECTED USER
  // ========================================================

  selectedUser = signal<UserModel | null>(null);

  // ========================================================
  // DETAILS
  // ========================================================

  viewDialogVisible = false;

  userDetailsFields = USER_DETAILS_FIELD;

  // ========================================================
  // INITIAL LOAD
  // ========================================================

  constructor() {
    this.loadUsers();
  }

  // ========================================================
  // LOAD USERS
  // ========================================================

  loadUsers(): void {
    this.administratorService
      .getAllUsers(this.currentPage, this.currentPageSize)
      .subscribe({
        next: (response: any) => {
          const content = response?.data?.content ?? response?.data ?? [];

          const users = Array.isArray(content) ? content : [];

          this.users.set(users);

          this.filteredUsers.set(users);

          this.totalRecords.set(response?.data?.totalElements ?? 0);
        },

        error: (error: any) => {
          console.error('Failed to load users:', error);

          this.users.set([]);

          this.filteredUsers.set([]);

          this.totalRecords.set(0);
        },
      });
  }

  // ========================================================
  // PAGINATION
  // ========================================================

  onPageChange(event: { page: number; size: number; first: number }): void {
    this.currentPage = event.page;

    this.currentPageSize = event.size;

    this.loadUsers();
  }

  // ========================================================
  // REFRESH
  // ========================================================

  onRefresh(): void {
    this.loadUsers();
  }

  // ========================================================
  // SEARCH
  // ========================================================

  onSearch(searchValue: string): void {
    const value = searchValue?.trim().toLowerCase();

    if (!value) {
      this.filteredUsers.set(this.users());

      return;
    }

    const filtered = this.users().filter((user) => {
      return String(user.username ?? '')
        .toLowerCase()
        .includes(value);
    });

    this.filteredUsers.set(filtered);
  }

  // ========================================================
  // VIEW
  // ========================================================

  viewUser(user: UserModel): void {
    this.selectedUser.set(user);

    this.viewDialogVisible = true;
  }

  // ========================================================
  // CREATE
  // ========================================================

  createNewUser(): void {
    this.formMode = 'create';

    this.selectedUser.set(null);

    this.showForm = true;
  }

  // ========================================================
  // EDIT
  // ========================================================

  editUser(user: UserModel): void {
    this.formMode = 'edit';

    this.selectedUser.set(user);

    this.showForm = true;
  }

  // ========================================================
  // FORM SAVED
  // ========================================================

  onUserSaved(): void {
    this.showForm = false;

    this.selectedUser.set(null);

    this.loadUsers();
  }

  // ========================================================
  // FORM CANCELLED
  // ========================================================

  onFormCancelled(): void {
    this.showForm = false;

    this.selectedUser.set(null);
  }

  // ========================================================
  // DELETE
  // ========================================================

  deleteUser(user: UserModel): void {
    const userId = user?.userId;

    if (userId === undefined || userId === null) {
      console.error('User ID is undefined. Cannot delete user.');

      return;
    }

    const username = user.username || 'this user';

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${username}?`,
    );

    if (!confirmDelete) {
      return;
    }

    this.administratorService.deleteUser(userId).subscribe({
      next: () => {
        this.loadUsers();
      },

      error: (error: any) => {
        console.error(`Failed to delete user with ID ${userId}:`, error);
      },
    });
  }
}
