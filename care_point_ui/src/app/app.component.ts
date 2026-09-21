import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedTableComponent, SharedTableConfig, TableColumn } from './shared/shared-table/shared-table.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'care_point_ui';
}
