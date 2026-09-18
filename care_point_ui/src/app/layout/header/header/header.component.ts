import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { MENU_ITEMS } from '../../../core/constants/menu.constants';
import { Menu } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { ProfileComponent } from '../../profile/profile/profile.component';

@Component({
  selector: 'app-header',
  imports: [ProfileComponent ,Menubar, Menu,DialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

items: MenuItem[] | undefined;
showProfile:boolean= false;

constructor(private router: Router) {}

ngOnInit() {
  this.items = MENU_ITEMS;
}
profileItems: MenuItem[] = [
    {
      label: 'My Profile',
      icon: 'pi pi-user',
      command: () => {
        this.openProfile();
      }
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: () => {
        this.openSettings();
      }
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        this.logout();
      }
    }
  ];


  openProfile(): void {
    this.showProfile= true;
    console.log('Open profile');
  }


  openSettings(): void {
    console.log('Open settings');
  }


  logout(): void {
  localStorage.removeItem('access_token');
  this.router.navigate(['/login']);
    console.log('Logout');
  }

}
