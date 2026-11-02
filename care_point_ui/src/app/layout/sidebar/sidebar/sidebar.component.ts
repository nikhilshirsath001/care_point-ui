import {
  Component,
  EventEmitter,
  HostListener,
  Output,
  inject,
  signal
} from '@angular/core';

import { NgClass } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { DrawerModule } from 'primeng/drawer';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';

import { filterMenu } from '../../../core/constants/menu.filter';
import { MENU_ITEMS } from '../../../core/constants/menu.constants';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    DrawerModule,
    MenuModule,
    PanelMenuModule,
    ButtonModule,
    AvatarModule,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  private readonly auth = inject(AuthService);

  /**
   * Notifies the parent layout whenever the sidebar
   * changes between collapsed and expanded states.
   */
  @Output()
  collapsedChange = new EventEmitter<boolean>();

  /**
   * The sidebar starts collapsed.
   */
  collapsed = true;

  /**
   * Permission-filtered navigation items.
   */
  readonly items: MenuItem[] = filterMenu(
    MENU_ITEMS,
    permission => this.auth.hasPermission(permission)
  );

  /**
   * Menu model used by PrimeNG PanelMenu.
   */
  readonly updatedItems = signal<MenuItem[]>([]);

  ngOnInit(): void {
    this.updateMenuItems();

    // Synchronize the initial state with the parent.
    this.collapsedChange.emit(this.collapsed);
  }

  /**
   * Expand the sidebar when clicking its navigation.
   */
  expandSidebar(): void {
    if (this.collapsed) {
      this.setCollapsed(false);
    }
  }

  /**
   * Toggle the sidebar state.
   */
  toggleSidebar(): void {
    this.setCollapsed(!this.collapsed);
  }

  /**
   * Collapse the sidebar when clicking outside it.
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (!target.closest('.sidebar-content')) {
      if (!this.collapsed) {
        this.setCollapsed(true);
      }
    }
  }

  /**
   * Update the state and notify the parent layout.
   */
  private setCollapsed(collapsed: boolean): void {
    if (this.collapsed === collapsed) {
      return;
    }

    this.collapsed = collapsed;

    this.updateMenuItems();

    this.collapsedChange.emit(this.collapsed);
  }

  /**
   * Create an independent copy of the menu model,
   * including nested menu items.
   */
  private updateMenuItems(): void {
    this.updatedItems.set(
      this.cloneMenuItems(this.items)
    );
  }

  /**
   * Clone nested menu items without changing MENU_ITEMS.
   */
  private cloneMenuItems(items: MenuItem[]): MenuItem[] {
    return items.map(item => ({
      ...item,
      items: item.items
        ? this.cloneMenuItems(item.items)
        : undefined
    }));
  }
}