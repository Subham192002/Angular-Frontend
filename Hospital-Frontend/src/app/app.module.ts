import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import{HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CreateHospitalComponent } from './create-hospital/create-hospital.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { UpdateHospitalComponent } from './update-hospital/update-hospital.component';
import { HospitalListComponent } from './hospital-list/hospital-list.component';
import { HospitalInterceptor } from './hospital.interceptor';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    CreateHospitalComponent,
    LoginPageComponent,
    UpdateHospitalComponent,
    HospitalListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ToastrModule.forRoot(
      {
        progressBar:true,
        timeOut:1200,
        preventDuplicates:true,
        positionClass: 'toast-top-right',
      }
    )
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,  
    {provide: HTTP_INTERCEPTORS, useClass:  HospitalInterceptor,multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
