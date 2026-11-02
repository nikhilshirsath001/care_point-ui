import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HeaderComponent } from '../../header/header/header.component';
import { FooterComponent } from '../../footer/footer/footer.component';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { GlobalLoaderComponent } from '../../../shared/global-loader/global-loader.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    SidebarComponent,
    GlobalLoaderComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

  /**
   * Initial state must match SidebarComponent.collapsed.
   */
  sidebarCollapsed = true;

  /**
   * Receives sidebar state changes.
   */
  onSidebarCollapsedChange(collapsed: boolean): void {
    this.sidebarCollapsed = collapsed;
  }
}