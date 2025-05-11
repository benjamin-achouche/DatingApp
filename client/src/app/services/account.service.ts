import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IUser } from '../models/user.model';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);

  baseUrl = environment.apiUrl;
  currentUser = signal<IUser | null>(null);

  register(model: any): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}/account/register`, model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      }),
    );
  }
  
  login(model: any): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}/account/login`, model).pipe(
      map(user => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      }),
    );
  }
  
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
  
}
