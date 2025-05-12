import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable, inject, model, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { IMember } from '../models/member.model';
import { Observable, of, tap } from 'rxjs';
import { IPhoto } from '../models/photo.model';
import { IList } from '../models/list.model';
import { IUserParams } from '../models/user-params.model';
import { mapToUserParams } from '../functions/user-params.mapper';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  membersList = signal<IList<IMember> | null>(null);
  memberCache = new Map();
  user = this.accountService.currentUser();
  userParams = signal<IUserParams>(mapToUserParams(this.user?.gender));

  resetUserParams() {
    this.userParams.set(mapToUserParams(this.user?.gender));
  }

  getMembers() {
    const response = this.memberCache.get(Object.values(this.userParams()).join("-"))
    
    if (response) return this.setPagingResponse(response);
    
    let params = this.setPagingHeaders(this.userParams().pageNumber, this.userParams().pageSize);

    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);
    
    return this.http.get<IMember[]>(`${this.baseUrl}/users`, { observe: 'response', params }).subscribe({
      next: res => {
        this.setPagingResponse(res);
        this.memberCache.set(Object.values(this.userParams()).join('-'), res);
      },
    })
  }

  private setPagingResponse(res: HttpResponse<IMember[]>) {
    this.membersList.set({
      items: res.body as IMember[],
      paging: JSON.parse(res.headers.get("Pagination")!)
    })
  }

  private setPagingHeaders(pageNumber: number, pageSize: number): HttpParams {
    let params = new HttpParams();

    if (pageNumber && pageSize) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
    }

    return params;
  }

  getMember(username: string): Observable<IMember> {
    const member: IMember = [...this.memberCache.values()]
      .reduce((arr, elem) => arr.concat(elem.body), [])
      .find((m: IMember) => m.username === username);

    if (member) return of(member);

    return this.http.get<IMember>(`${this.baseUrl}/users/${username}`);
  }

  updateMember(member: IMember) {
    return this.http.put(`${this.baseUrl}/users`, member).pipe(
      // tap(() => this.members.update(members => members.map(m => m.username === member.username ? member : m)))
    )
  }

  setMainPhoto(photo: IPhoto) {
    return this.http.put(`${this.baseUrl}/users/set-main-photo/${photo.id}`, {}).pipe(
      // tap(() => this.members.update(members => members.map(m => {
      //   if (m.photos.includes(photo)) m.photoUrl = photo.url;
      //   return m;
      // })))
    )
  }

  deletePhoto(photo: IPhoto) {
    return this.http.delete(`${this.baseUrl}/users/delete-photo/${photo.id}`).pipe(
      // tap(() => this.members.update(members => members.map(m => {
      //   if (m.photos.includes(photo)) m.photos = m.photos.filter(p => p.id !== photo.id);
      //   return m;
      // })))
    )
  }
}