import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/admin/users`);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/admin/users/${userId}`);
  }

  createUser(userData: Partial<User> & { password: string }): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/admin/users`, userData);
  }

  updateUser(userId: string, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${environment.apiUrl}/admin/users/${userId}`, userData);
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${environment.apiUrl}/admin/users/${userId}`);
  }
}
