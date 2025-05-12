import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IList } from '../models/list.model';
import { IMember } from '../models/member.model';
import { setPagingHeaders, setPagingResponse } from '../functions/helpers';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  likeIds = signal<number[]>([]);
  membersList = signal<IList<IMember> | null>(null);

  toggleLike(targetId: number) {
    return this.http.post(`${this.baseUrl}/likes/${targetId}`, {})
  }

  getLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = setPagingHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    return this.http.get<IMember[]>(`${this.baseUrl}/likes`, { observe: 'response', params }).subscribe({
        next: response => setPagingResponse(response, this.membersList)
      })
  }

  getLikeIds() {
    return this.http.get<number[]>(`${this.baseUrl}/likes/list`).subscribe({
      next: ids => this.likeIds.set(ids)
    })
  }
}