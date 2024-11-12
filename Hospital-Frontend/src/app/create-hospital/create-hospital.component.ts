import { Component, OnInit } from '@angular/core';
import { Hospital } from '../hospital';
import { HospitalService } from '../hospital.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-hospital',
  templateUrl: './create-hospital.component.html',
  styleUrls: ['./create-hospital.component.css']
})
export class CreateHospitalComponent implements OnInit {

  hospital: Hospital = new Hospital();
  errorMessages: any = {};
  department:any[]=[];


  constructor(   
    private hospitalService : HospitalService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr : ToastrService
   
  ) { }

  ngOnInit(): void {
   this.hospitalService.getDept().subscribe(data=>
   {
    this.department=data;
   }
   )
  }

  onSubmit(){
    this.hospitalService
    .createHospital(this.hospital)
    .subscribe(
      (data:any)=>{
        if(data && data.code === "ID Already Exists"){
          this.toastr.warning("ID already Exists")
        }
        else{
          setTimeout(() => {
            this.goToHospitalList();
           this.toastr.success(" Patient Created Succesfully")
          }, 500);
        }
        
      },
      (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.handleValidationErrors(error.error.errors);
        } else {
          console.error("An unexpected error occurred:", error);
          alert("Failed to create due to an unexpected error.");
        }
      }
    );
  }
  goToHospitalList() {
    this.router.navigate(["/hospital-list"])
  }

  handleValidationErrors(errors: string[]) {
    this.errorMessages = {};

    errors.forEach((error) => {
      if (error.includes("PatientID")){
        this.errorMessages.patientId = error;
      }
      if (error.includes("DoctorID")) {
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
      if (error.includes("PatientName")) {
        this.errorMessages.patientName = error;
      }
      if (error.includes("Gender")) {
        this.errorMessages.gender = error;
      }
      if (error.includes("Contact")) {
        this.errorMessages.contact = error;
      }
      if (error.includes("Disease")) {
        this.errorMessages.disease = error;
      }
      if (error.includes("Admit")) {
        this.errorMessages.admitDate = error;
      }
      
    });
  }

  onChange(){

  }

}

