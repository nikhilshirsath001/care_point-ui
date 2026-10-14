import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { DashboardChartType } from '../../core/constants/app.constants';
@Component({
  selector: 'app-dashboard',
  imports: [ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnChanges {

  @Input() type: DashboardChartType = 'pie';

  @Input() title = 'Chart';

  @Input() subtitle = '';

  @Input() data: any[] = [];

  @Input() labels: string[] = [];

  @Input() colors: string[] = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4'
  ];

  @Input() height = '280px';

  @Input() showLegend = true;

  @Input() legendPosition: 'top' | 'bottom' | 'left' | 'right' = 'bottom';

  chartData: any;

  chartOptions: any;

  ngOnChanges(changes: SimpleChanges): void {
    this.buildChart();
  }

  private buildChart(): void {

    this.chartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.data,
          backgroundColor: this.colors,
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 8
        }
      ]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: this.showLegend,
          position: this.legendPosition,

          labels: {
            usePointStyle: true,
            padding: 18,
            font: {
              size: 13
            }
          }
        },

        tooltip: {
          enabled: true
        }
      }
    };
  }
}