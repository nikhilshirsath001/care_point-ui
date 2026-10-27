import { Component, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { filterMenu } from '../../../core/constants/menu.filter';
import { inject } from '@angular/core';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { MENU_ITEMS } from '../../../core/constants/menu.constants';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from '../../../core/auth/auth.service';
@Component({
  selector: 'app-sidebar',
  imports: [
    DrawerModule,
    MenuModule,
  PanelMenuModule,
   ButtonModule, AvatarModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
visible = true;

  private auth = inject (AuthService);

items: MenuItem[] = filterMenu(MENU_ITEMS, p => this.auth.hasPermission(p));

      @ViewChild('drawerRef') drawerRef!: Drawer;

    closeCallback(e:any): void {
        this.drawerRef.close(e);
    }

}
