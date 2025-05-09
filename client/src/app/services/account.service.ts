import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IUser } from '../models/user.model';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  baseUrl = "https://localhost:5001/api";
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
      catchError(e => {
        console.log(e);
        return EMPTY;
      })
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
      catchError(e => {
        console.log(e);
        return EMPTY;
      })
    );
  }
  
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
  
}
