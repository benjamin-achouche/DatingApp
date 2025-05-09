import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IUser } from '../models/user.model';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  private toastr = inject(ToastrService);

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
        this.toastr.error(e.error)
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
        this.toastr.error(e.error)
        return EMPTY;
      })
    );
  }
  
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
  
}
