import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IMember } from '../../../models/member.model';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { IMessage } from '../../../models/message.model';
import { MessagesService } from '../../../services/messages.service';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.scss'
})
export class MemberDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('memberTabs') memberTabs?: TabsetComponent;
  private messagesService = inject(MessagesService);
  private route = inject(ActivatedRoute);
  member = {} as IMember;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
  messages: IMessage[] = [];

  ngOnInit(): void {
    this.route.data.subscribe({
      next: data => {
        this.member = data['member'];
        this.member && this.member.photos.map(p => this.images.push(new ImageItem({src: p.url, thumb: p.url})));
      }
    });
  }
  
  ngAfterViewInit() {
    this.route.queryParams.subscribe({
      next: (params) => params['tab'] && this.selectTab(params['tab'])
    })
  }

  onUpdateMessages(event: IMessage) {
    this.messages.push(event);
  }
  
  selectTab(heading: string) {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(t => t.heading === heading);
      if (messageTab) messageTab.active = true;
    }
  }
  
  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    if (this.activeTab.heading === "Messages" && this.messages.length === 0 && this.member) {
      this.messagesService.getMessageThread(this.member.username).subscribe({
        next: messages => this.messages = messages,
      });
    }
  }

}