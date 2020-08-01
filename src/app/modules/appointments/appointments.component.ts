import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppointmentsService } from '../appointments.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { mapStyle } from 'src/app/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss']
})

export class AppointmentsComponent implements OnInit {
  @ViewChild('createAppointment') createAppointment: TemplateRef<any>;
  displayedColumns: string[] = ['name', 'mobile', 'email', 'date', 'time', 'status', 'action'];
  appointsmentsData = [];
  dataSource = new MatTableDataSource(this.appointsmentsData);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  user = JSON.parse(localStorage.getItem('currentUser'));
  appointmentForm: FormGroup;
  locations = [];
  doctors = [];
  loading = false;
  appointment: any = {};
  zoom: number = 10;
  lat = 51.678418;
  lng = 7.809007;
  mapType = mapStyle.night;

  constructor(private appointmentService: AppointmentsService, private _snackBar: MatSnackBar, private dialog: MatDialog, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.appointmentForm = new FormGroup({
      location: new FormControl('', [Validators.required]),
      doctor: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      time: new FormControl('', [Validators.required])
    });
    this.dataSource.paginator = this.paginator;
    this.getAppointments();
    this.getLocations();
  }
  getLocations() {
    this.appointmentService.getLocations().subscribe((resp: any) => {
      // let data = resp.sort(function (a, b) { return b._id - a._id; });
      this.locations = resp;
    });
  }
  getDoctors() {
    this.setLatNLong(this.appointment.location);
    this.appointmentService.getDoctors(this.appointment.location).subscribe((resp: any) => {
      // let data = resp.sort(function (a, b) { return b._id - a._id; });
      this.doctors = resp;
    });
  }
  getAppointments() {
    this.appointmentService.getAppointments(this.user._id, this.user.location_id).subscribe((resp: any) => {
      let data = resp.sort(function (a, b) { return b._id - a._id; });
      this.dataSource = new MatTableDataSource(data);
    });
  }

  updateStatus(_id, status) {
    this.appointmentService.updateAppointment(_id, status).subscribe((resp) => {
      console.log(resp);
      this.getAppointments();
    })
  }

  createAppointmentFunc() {
    this.appointment = {};
    this.appointmentForm.reset();
    let dialogRef = this.dialog.open(this.createAppointment, { panelClass: 'appointment-dialog-container', hasBackdrop: false });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result !== undefined) {
        // this.openSnackBar('Camera added!!!')
      }
    })
  }
  get f() { return this.appointmentForm.controls; }
  submit() {
    this.loading = true;
    let payload = {
      "date": this.formatDate(this.f.date.value),
      "time": this.f.time.value,
      "location_id": this.f.location.value,
      "doctor_id": this.f.doctor.value,
      "patient_id": this.user._id
    }
    this.appointmentService.createAppointment(payload).subscribe((resp: any) => {
      setTimeout(() => {
        this.loading = false;
        console.log(resp)
        this.appointment = {};
        this.appointmentForm.reset();
        this.getAppointments();
        this.getDoctors();
        this.dialog.closeAll();
        if(resp.statusCode){
          this.openSnackBar('Appointment created!')
        }else{
          this.openSnackBar('Appointment not created! something went wrong!')
        }
      }, 1000)
    })
  }

  setLatNLong(_id) {
    let location: any = this.locations.filter((loc) => {
      return loc._id == _id;
    });
    if (location.length > 0) {
      this.lat = parseFloat(location[0].lat);
      this.lng = parseFloat(location[0].long);
    }
  }

  openSnackBar(message: string, action: string = 'Okay') {
    this._snackBar.open(message, action, {
      duration: 3500,
    });
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
