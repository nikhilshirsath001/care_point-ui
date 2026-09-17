import { Component, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';

import { Drawer, DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { MENU_ITEMS } from '../../../core/constants/menu.constants';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';

import { Ripple } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { StyleClass } from 'primeng/styleclass';
@Component({
  selector: 'app-sidebar',
  imports: [
    DrawerModule,
    MenuModule,
  PanelMenuModule,
   ButtonModule, Ripple, AvatarModule, StyleClass],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
visible = true;

  items: MenuItem[] =MENU_ITEMS;

      @ViewChild('drawerRef') drawerRef!: Drawer;

    closeCallback(e:any): void {
        this.drawerRef.close(e);
    }

}
