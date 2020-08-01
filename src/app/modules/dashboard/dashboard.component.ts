import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from './../dashboard.service';
import { AppointmentsService } from '../appointments.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  cards = [71, 78, 39, 66];
  pieChart = [];
  cardData = [];
  bigChart = [];
  user:any = JSON.parse(localStorage.getItem('currentUser'));
  displayedColumns: string[] = ['name', 'mobile', 'email', 'date', 'time', 'status'];
  appointsmentsData = [];
  dataSource = new MatTableDataSource(this.appointsmentsData);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  constructor(private dashboardService: DashboardService, private appointmentService: AppointmentsService) { }

  ngOnInit() {
    this.dashboardService.bigChart(this.user._id).subscribe((data: any) => {
      this.bigChart = data;
    });
        
    this.dashboardService.cards(this.user._id).subscribe((data: any) => {
      this.cardData = data;
    });

    this.dashboardService.pieChart(this.user._id).subscribe((data: any) => {
      this.pieChart = data;
    });

    this.dataSource.paginator = this.paginator;
    this.getAppointments()
  }

  getAppointments() {
    this.appointmentService.getAppointments(this.user._id, this.user.location_id).subscribe((resp: any) => {
      let data = resp.sort(function (a, b) { return b._id - a._id; });
      this.dataSource = new MatTableDataSource(data.slice(0, 5));
    });
  }
}