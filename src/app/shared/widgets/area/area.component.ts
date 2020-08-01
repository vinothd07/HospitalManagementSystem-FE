import { Component, OnInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';


@Component({
  selector: 'app-widget-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  chartOptions: {};
  @Input() data: any = [];
  @Input() label: any = [];

  Highcharts = Highcharts;
  labels = [];
  datas = [];
  constructor() { }
  items = [];
  ngOnInit() {
    this.data.forEach((item: any) => {
      this.labels.push(item.date);
      this.datas.push(item.count);
    })
    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'Last 7 days appointments'
      },
      subtitle: {
        text: 'Total Appointments'
      },
      xAxis: {
        categories: this.labels
      },
      yAxis: {
        title: {
          text: 'Count'
        }
      },
      plotOptions: {
        line: {
          dataLabels: {
            enabled: true
          },
          enableMouseTracking: true
        }
      },
      series: [{
        name: 'Total Appointments',
        data: this.datas
      }]
    };

    // HC_exporting(Highcharts);

    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

}