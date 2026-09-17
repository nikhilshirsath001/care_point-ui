import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { MENU_ITEMS } from '../../../core/constants/menu.constants';

@Component({
  selector: 'app-header',
  imports: [Menubar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

items: MenuItem[] | undefined;

constructor(private router: Router) {}

ngOnInit() {
  this.items = MENU_ITEMS;
}
}
