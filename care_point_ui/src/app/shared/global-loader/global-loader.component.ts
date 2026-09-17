import { Component, inject } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-global-loader',
  imports: [
    ProgressSpinnerModule
  ],
  templateUrl: './global-loader.component.html',
  styleUrl: './global-loader.component.css'
})
export class GlobalLoaderComponent {
  loadingService = inject(LoadingService);

}
