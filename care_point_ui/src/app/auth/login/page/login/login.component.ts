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

  login(event: any) {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) return;
    this.authService.login(this.formGroup.value).subscribe((res: any) => {
      // if (res.status == 1 || res.status == 3) {
      //   const userRole = res.data.roles;
        
      //   if ((userRole.includes(Roles.EXECUTIVE))) {
      //     this.router.navigate([this.route]).then(() => {
      //       this.tostr.showSuccess(res.message, "Success");
      //     })
      //   }
      //   else if(userRole.includes(Roles.ADMIN) || userRole.includes(Roles.SUPERVISOR)) {
      //     this.router.navigate(['/dashboard/dashboard']).then(() => {
      //       this.tostr.showSuccess(res.message, "Success");
      //       if (res.status == 3) {
      //         this.tostr.showWarning("Please Change Password", "Warning");
      //       }
      //     });
      //   }
      // } else {
      //   console.log('Error Page');
      //   this.tostr.showError(res.message, 'Error');
      // }
    });
  }
}
