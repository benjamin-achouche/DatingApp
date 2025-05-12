import { Component, ViewChild, inject, input, output } from '@angular/core';
import { IMessage } from '../../../models/message.model';
import { MessagesService } from '../../../services/messages.service';
import { TimeagoModule } from 'ngx-timeago';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [TimeagoModule, FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.scss'
})
export class MemberMessagesComponent {
  @ViewChild('messageForm') messageForm?: NgForm;
  private messagesService = inject(MessagesService);
  username = input.required<string>();
  messages = input.required<IMessage[]>();
  messageContent = '';
  updateMessages = output<IMessage>();
  
  sendMessage() {
    this.messagesService.sendMessage(this.username(), this.messageContent).subscribe({
      next: message => {
        this.updateMessages.emit(message);
        this.messageForm?.reset();
      }
    })
  }
}