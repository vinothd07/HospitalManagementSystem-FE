import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {

  constructor(private http: HttpClient) { }

  getLocations(){
    return this.http.get(`${environment.apiUrl}main/api/get_all_locations`);
  }
  getDoctors(location_id){
    return this.http.get(`${environment.apiUrl}main/api/get_doctors/${location_id}`);
  }

  getAppointments(user_id, location_id) {
    return this.http.get(`${environment.apiUrl}main/api/get_all_appointments/${user_id}/${location_id}`);
  }

  updateAppointment(_id, status){
    return this.http.put(`${environment.apiUrl}main/api/update_appointment/${_id}/${status}`, {}, {});
  }

  createAppointment(payload){
    return this.http.post(`${environment.apiUrl}main/api/create_appointment`, payload);
  }
}
