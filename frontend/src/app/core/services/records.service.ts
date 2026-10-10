import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Record } from '../../shared/models/record.model';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  constructor(private http: HttpClient) {}

  getUserRecords(userId: string, delay?: number): Observable<Record[]> {
    const url = `${environment.apiUrl}/users/${userId}/records`;
    let params = new HttpParams();
    if (delay) {
      params = params.set('delay', delay.toString());
    }
    return this.http.get<Record[]>(url, { params });
  }
}
