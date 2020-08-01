import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const expectedPermissions = route.data.roles;
        if (currentUser) {
            if (expectedPermissions) {
                const found = expectedPermissions.indexOf(currentUser.role_id) > -1;
                if (!found) {
                    // this.router.navigate(['/forbidden']);
                    // return false;
                    localStorage.removeItem('currentUser');
                    this.router.navigate(['/login']);
                }else{
                    return true;
                }
            } else {
                return true;
            }
        }

        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}