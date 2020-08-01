import { Router, ActivatedRoute } from '@angular/router';
import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router,
    private authenticationService: AuthenticationService, private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '';
  }
  get f() { return this.loginForm.controls; }

  submit(): void {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          console.log('1st data:', data)
          if(!data.code){
            console.log('2nd data:', data.code)
            this.openSnackBar('Authentication success, please wait..')
            setTimeout(() => {
              if (data.role_id != 1) {
                console.log('inside role:', data.role_id)
                this.router.navigate(['appointments']);
              }else{
                console.log('inside this.returnUrl:', this.returnUrl)
                this.router.navigate([this.returnUrl]);
              }
            }, 1500);
          }else{
            console.log('3nd data:', data.errorMessage)
            this.loading = false;
            this.openSnackBar(data.errorMessage);
          }
        },
        error => {
          console.log('4th data:', 'error')
          this.loading = false;
          this.openSnackBar(error);
        });
  }
  openSnackBar(message: string, action: string = 'Okay') {
    this._snackBar.open(message, action, {
      duration: 3500,
    });
  }
}
