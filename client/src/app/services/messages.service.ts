import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { IMessage } from '../models/message.model';
import { IList } from '../models/list.model';
import { setPagingHeaders, setPagingResponse } from '../functions/helpers';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  messagesList = signal<IList<IMessage> | null>(null);

  getMessages(pageNumber: number, pageSize: number, container: string) {
    let params = setPagingHeaders(pageNumber, pageSize);

    params = params.append('Container', container);

    return this.http.get<IMessage[]>(`${this.baseUrl}/messages`, {observe: 'response', params})
      .subscribe({
        next: response => setPagingResponse(response, this.messagesList)
      })
  }

  getMessageThread(username: string) {
    return this.http.get<IMessage[]>(`${this.baseUrl}/messages/thread/${username}`);
  }

  sendMessage(username: string, content: string) {
    return this.http.post<IMessage>(`${this.baseUrl}/messages`, { recipientUsername: username, content })
  }

  deleteMessage(id: number) {
    return this.http.delete(`${this.baseUrl}/messages/${id}`);
  }
}