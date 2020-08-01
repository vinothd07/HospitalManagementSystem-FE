import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from './../environments/environment';

@Injectable()
export class AuthenticationService {
  constructor(private http: HttpClient, private router:Router) { }

  login(username: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}main/api/user/login`, { username: username, password: password })
      .pipe(map(user => {
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        }else{
          return user;
        }
      }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    // this.router.navigate(['/login']);
  }
}