import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }
  getAllLocations() {
    return this.http.get(`${environment.apiUrl}main/api/get_all_locations`);
  }
  bigChart(_id) {
    return this.http.get(`${environment.apiUrl}main/api/main_graph/${_id}`);
  }

  cards(_id) {
    return this.http.get(`${environment.apiUrl}main/api/cards/${_id}`);
  }

  pieChart(_id) {
    return this.http.get(`${environment.apiUrl}main/api/pie/${_id}`);
  }
}