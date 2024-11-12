import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { HospitalListComponent } from './hospital-list/hospital-list.component';
import { UpdateHospitalComponent } from './update-hospital/update-hospital.component';
import { CreateHospitalComponent } from './create-hospital/create-hospital.component';
import { HospitalGuard } from './hospital.guard';


const routes: Routes = [
  {path: '', redirectTo: 'login-page', pathMatch: 'full'},
  {path :'hospital-list', component : HospitalListComponent},
  {path :'login-page', component : LoginPageComponent},
  {path: 'update-hospital/:patientId/:doctorId/:deptName', component: UpdateHospitalComponent,canActivate:[HospitalGuard]},
  {path: 'create-hospital', component: CreateHospitalComponent,canActivate:[HospitalGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
