import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Menu } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';

import { ProfileComponent } from '../../profile/profile/profile.component';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    Menubar,
    Menu,
    DialogModule,
    ProfileComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  showProfile = false;

  profileItems: MenuItem[] = [
    {
      label: 'My Profile',
      icon: 'pi pi-user',
      command: () => this.openProfile()
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => this.openSettings()
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  openProfile(): void {
    this.showProfile = true;
  }

  openSettings(): void {
    // Implement the settings navigation when available.
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}