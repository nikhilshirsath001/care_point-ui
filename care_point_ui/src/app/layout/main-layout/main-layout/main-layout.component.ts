import { Component } from '@angular/core';
import { HeaderComponent } from '../../header/header/header.component';
import { FooterComponent } from '../../footer/footer/footer.component';
import { SidebarComponent } from '../../sidebar/sidebar/sidebar.component';
import { RouterOutlet } from '@angular/router';
import { GlobalLoaderComponent } from '../../../shared/global-loader/global-loader.component';

@Component({
  selector: 'app-main-layout',
  imports: [HeaderComponent, FooterComponent, RouterOutlet, SidebarComponent, GlobalLoaderComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
