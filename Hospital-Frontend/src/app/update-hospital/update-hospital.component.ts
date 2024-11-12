import { Component, OnInit } from '@angular/core';
import { Hospital } from '../hospital';
import { ActivatedRoute, Router } from '@angular/router';
import { HospitalService } from '../hospital.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-hospital',
  templateUrl: './update-hospital.component.html',
  styleUrls: ['./update-hospital.component.css']
})
export class UpdateHospitalComponent implements OnInit {

  
  patientId: number;
  doctorId: number;
  deptName: string;
  hospital: Hospital = new Hospital();
  errorMessages: any = {};

  constructor(
    private hospitalService : HospitalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr : ToastrService
  ) { }


  ngOnInit(): void{

    if(localStorage.getItem("check")=="yes"){
      this.patientId = this .route.snapshot.params["patientId"];
      this.doctorId = this .route.snapshot.params["doctorId"];
      this.deptName= this.route.snapshot.params["deptName"]
      this.hospitalService.getHospitalById(this.patientId,this.doctorId,this.deptName).subscribe(
      (data)=>{
        this.hospital=data;
      },
      (error)=> console.log(error)
    );
    }
    else{
      this.router.navigate(['hospital-list']);
    }
    
  }

  onSubmit(): void {
    this.hospitalService
    .updateHospital(this.patientId,this.doctorId,this.deptName ,this.hospital)
    .subscribe(
      (data)=>{
        setTimeout(() => {
          this.goToHospitalList();
          this.toastr.success("DETAILS UPDATED SUCCESSFULLY")
        }, 500);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.handleValidationErrors(error.error.errors);
        } else {
          console.error("An unexpected error occurred:", error);
          alert("Failed  due to an unexpected error.");
        }
      }
    );
  }

  goToHospitalList(){
    this.router.navigate(["/hospital-list"]);
  }

  handleValidationErrors(errors: string[]) {
    this.errorMessages = {};

    errors.forEach((error) => {
      if (error.includes("Patient")){
        this.errorMessages.patientId = error;
      }
      if (error.includes("Doctor")) {
        this.errorMessages.doctorId = error;
      }
      if (error.includes("Department")) {
        this.errorMessages.deptName = error;
      }
      if (error.includes("Doctorname")) {
        this.errorMessages.doctorName = error;
      }
      if (error.includes("Specialization")) {
        this.errorMessages.specialization = error;
      }
      if (error.includes("Gender")) {
        this.errorMessages.gender = error;
      }
      if (error.includes("Patient")) {
        this.errorMessages.patientName = error;
      }
      if (error.includes("Contact")) {
        this.errorMessages.contactNumber = error;
      }
      if (error.includes("Admit")) {
        this.errorMessages.admitDate = error;
      }
      
    });

  }

}

