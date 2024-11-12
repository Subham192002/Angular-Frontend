import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';
import { HospitalService } from '../hospital.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  showLoginForm =false;
  user: User = new User();
  errorMessage: string = ''; 
  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private hospital: HospitalService,
    private router: Router,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem("accesstoken")
  }

  getStarted() {
    this.showLoginForm = true;
  }

  ValidationUser: String='';
  ValidationPassword: String='';


  onSubmit() {
    this.hospital.login(this.user).subscribe({
      next: (data) => {
        if (data.message === 'Incorrect Password') {
          this.ValidationPassword = data.message; 
        } 
        else if(data.message === "Incorrect UserName"){
          this.ValidationUser = data.message;
        }

        else {
          localStorage.setItem('accesstoken', data.details[0].access_token);
          this.toastr.success("Login Successfull")
          this.router.navigate(['hospital-list']);
        }
      },
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  removeVal(){
    this.ValidationUser='';
    this.ValidationPassword='';
  }

}
