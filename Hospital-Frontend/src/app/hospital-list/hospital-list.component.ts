import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hospital } from '../hospital';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as $ from "jquery";
import "datatables.net";
import "datatables.net-dt";
import { HospitalService } from '../hospital.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hospital-list',
  templateUrl: './hospital-list.component.html',
  styleUrls: ['./hospital-list.component.css']
})
export class HospitalListComponent implements OnInit, OnDestroy {
  bearerToken: String = localStorage.getItem("accesstoken");
  hospitals: Hospital[] = [];
  selectedhospital: Hospital | null = null;
  searchid = null;
  searchName = "";
  searchPatient="";
  searchDisease="";
  searchFrom = "";
  searchTo = "";
  department:any[]=[];
  documentClickListener: any;
  intervalid: any;
  showDateFields = false;

  constructor(
    private hospitalService: HospitalService,
    private router: Router,
    private http: HttpClient,
    private toastr: ToastrService,
    private jwtservice: JwtHelperService
  ) {}

  ngOnInit(): void {
    localStorage.setItem("check", "no");
    this.initDataTable();
    this.getDept();
    this.intervalid = setInterval(() => {
      if ((localStorage.getItem("accesstoken") != null) && (this.jwtservice.isTokenExpired(localStorage.getItem("accesstoken")))) {
        alert("Your Session Expired");
        localStorage.removeItem('accesstoken');
        this.router.navigateByUrl('login-page');
      }
    }, 500);
  }

  getDept(){
    this.hospitalService.getDept().subscribe(data=>
      {
       this.department=data;
      }
      )
  }

  ngAfterViewInit(): void {
    this.documentClickListener = (event: Event) => {
      if (!$(event.target).closest("#hospitalTable").length) {
        this.unselectRow();
      }
    };

    $(document).on("click", this.documentClickListener);
  }

  ngOnDestroy(): void {
    $(document).off("click", this.documentClickListener);
    clearInterval(this.intervalid);
  }

  private initDataTable() {
    const table = $("#hospitalTable").DataTable({
      searching: false,
      paging: true,
      lengthMenu: [5, 10, 20, 30],
      ordering: false,
      serverSide: true,
      processing: true,
      ajax: (data: any, callback: any) => {
        this.http.get('http://localhost:7777/hospital/api/search', {
          params: {
            iDisplayStart: (data.start / data.length).toString(),
            iDisplayLength: data.length.toString(),
            searchParam: JSON.stringify({
              patientId: this.searchid,
              deptName: this.searchName,
              patientName: this.searchPatient,
              disease:this.searchDisease,
              fromDate: this.searchFrom,
              toDate: this.searchTo
            })
          }
        }).subscribe((response: any) => {
          console.log(response);
          callback({
            draw: data.draw,
            recordsTotal: response.iTotalRecords,
            recordsFiltered: response.iTotalDisplayRecords,
            data: response.aaData,
          });
        });
      },
      columns: [
        { data: "patientId" },
        { data: "doctorId" },
        { data: "deptName" },
        { data: "doctorName" },
        { data: "specialization" },
        { data: "patientName" },
        { data: "gender" },
        { data : "disease"},
        { data: "contactNumber" },
        { data: "admitDate" },
        {
          data: "status",
          render: function (data) {
            if (data === "Admitted" || data === "admitted" || data === "ADMITTED" ) {
              return '<span style="color: green; font-weight: bold;">admitted</span>';
            } else if (data === "DISCHARGED" || data === "Discharged" || data === "discharged") {
              return '<span style="color: red; font-weight: bold;">discharged</span>';
            } else {
              return data;
            }
          },
        },
      ],
    });

    $("#hospitalTable tbody").on("click", "tr", (event) => {
      const selectedData = table.row(event.currentTarget).data();
      if (this.selectedhospital && selectedData && this.selectedhospital.patientId === selectedData.patientId) {
        this.unselectRow();
      } else {
        $("#hospitalTable tbody tr").removeClass("selected");
        $(event.currentTarget).addClass("selected");
        this.selectedhospital = selectedData;
        this.enableButtons(true);
      }
    });

    $("#deleteBtn").on("click", () => this.deleteSelectedHospital());
    $("#updateBtn").on("click", () => this.updateSelectedHospital());
  }

  private unselectRow() {
    $("#hospitalTable tbody tr").removeClass("selected");
    this.selectedhospital = null;
    this.enableButtons(false);
  }

  private enableButtons(enabled: boolean) {
    const actionButtons = ["#deleteBtn", "#updateBtn"];
    actionButtons.forEach((buttonId) => {
      $(buttonId).prop("disabled", !enabled);
    });
  }

  updateSelectedHospital() {
    if (this.selectedhospital) {
      if (this.selectedhospital.status === "discharged") {
        this.toastr.warning("You cannot update this ")
        return;
      }

      const { patientId, doctorId,deptName } = this.selectedhospital;
      localStorage.setItem("check", "yes");
      this.router.navigate(["update-hospital", patientId, doctorId,deptName]);
    }
  }

  deleteSelectedHospital() {
    if (this.selectedhospital) {
      if (this.selectedhospital.status === "discharged") {
        this.toastr.warning("This patient has already been discharged.");
        return;
      }

      const { patientId, doctorId,deptName } = this.selectedhospital;
      const confirmed = window.confirm("Are you sure you want to discharge the Patient?");

      if (confirmed) {
        this.hospitalService.deleteHospital(patientId, doctorId,deptName).subscribe(
          () => {
            setTimeout(() => {
              $('#hospitalTable').DataTable().destroy();
              this.initDataTable();
              this.toastr.success("Patient Discharged", "Success")
            }, 1000);
          },
          (error) => {
            console.error("Error updating :", error);
          }
        );
      }
    }
  }

  onSearch() {
    $('#hospitalTable').DataTable().destroy();
    this.initDataTable();
  }

  clearSearch() {
    this.searchid = null;
    this.searchName = "";
    this.searchFrom = "";
    this.searchTo = "";
    this.searchDisease="";
    this.searchPatient="";

    $('#hospitalTable').DataTable().destroy();
    this.initDataTable();
  }

  logOut() {
    localStorage.removeItem("accesstoken");
    this.toastr.success("Log Out Successfully");
    this.router.navigate(["login-page"]);
  }

  toggleDown() {
    this.showDateFields = !this.showDateFields;
  }
}

