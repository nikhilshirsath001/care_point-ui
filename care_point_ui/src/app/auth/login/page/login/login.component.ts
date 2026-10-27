import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../../../core/auth/auth.service';
import { Constants } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-login',
  imports: [
    InputTextModule,
    CommonModule,
    ReactiveFormsModule,
    InputGroupAddonModule,
    InputGroupModule,
    PasswordModule,
    DividerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    Constants = Constants;
  errorMessage: string = '';

 formGroup: FormGroup;
  isPasswordVisible: boolean = false;
  private route = '/workflow/process';
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
    ) {
    this.formGroup = this.fb.group({
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[^\\-\\s][a-zA-Z0-9_.@\\s-]+[^\\-\\s]$'),
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[^\\-\\s][a-zA-Z0-9_.@\\s-]+[^\\-\\s]$'),
        ]),
      ],
    });
  }
  get formControls() {
    return this.formGroup.controls;
  }


  login(event: Event) {
    event.preventDefault();

    this.formGroup.markAllAsTouched();
    if (this.formGroup.invalid) {
      return;
    }
  
  this.errorMessage = '';
this.authService.login(this.formGroup.value).subscribe({
  next: (res: any) => {
    if (res.status === 1) {
      this.router.navigate(['/main']);
    } else {
      this.errorMessage = res.message || 'Login failed';
    }
  },
  error: (err) => {
    this.errorMessage = err?.error?.message || 'Invalid username or password';
  },
      });}}