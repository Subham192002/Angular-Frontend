import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { User } from "./user";
import { Hospital } from "./hospital";

@Injectable({
  providedIn: "root",
})
export class HospitalService {
  token: String = "";
  private accessUrl = "http://localhost:7777/hospital/api/getaccesstoken";
  private baseURL = "http://localhost:7777/hospital/api";

  constructor(private httpClient: HttpClient) {}

  createHospital(hospital: Hospital): Observable<any> {
    return this.httpClient.post(`${this.baseURL}/create`, hospital);
  }

  getHospitalById(
    patientId: number,
    doctorId: number,
    deptName: string
  ): Observable<Hospital> {
    return this.httpClient.get<Hospital>(
      `${this.baseURL}/get/${patientId}/${doctorId}/${deptName}`
    );
  }

  updateHospital(
    patientId: number,
    doctorId: number,
    deptName: string,
    hospital: Hospital
  ): Observable<Object> {
    return this.httpClient.put(
      `${this.baseURL}/update/${patientId}/${doctorId}/${deptName}`,
      hospital
    );
  }

  deleteHospital(
    patientId: number,
    doctorId: number,
    deptName: string
  ): Observable<Hospital> {
    return this.httpClient.delete<Hospital>(
      `${this.baseURL}/remove/${patientId}/${doctorId}/${deptName}`
    );
  }

  login(user: User): Observable<any> {
    return this.httpClient.post<any>(`${this.accessUrl}`, user);
  }

  getDept(): Observable<any> {
    return this.httpClient.get<any>(`${this.baseURL}/dept/getAll`);
  }
}
