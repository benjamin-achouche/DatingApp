import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { IUser } from '../models/user.model';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MembersService } from './members.service';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private http = inject(HttpClient);
  private likesService = inject(LikesService);
  // membersService = inject(MembersService); // Causes circular dependency

  baseUrl = environment.apiUrl;
  currentUser = signal<IUser | null>(null);

  register(model: any): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}/account/register`, model).pipe(
      map(user => {
        if (user) this.setCurrentUser(user);
        return user;
      }),
    );
  }
  
  login(model: any): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}/account/login`, model).pipe(
      map(user => {
        if (user) this.setCurrentUser(user);
        return user;
      }),
    );
  }
  
  setCurrentUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }
  
  logout() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
    // this.membersService.membersList.set(null);
  }
  
}
