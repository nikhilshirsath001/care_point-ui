import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { MENU_ITEMS } from '../../../core/constants/menu.constants';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-header',
  imports: [Menubar, Menu],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

items: MenuItem[] | undefined;

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
    console.log('Open profile');
  }


  openSettings(): void {
    console.log('Open settings');
  }


  logout(): void {
    console.log('Logout');
  }

}
