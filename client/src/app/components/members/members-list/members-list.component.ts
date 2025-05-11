import { Component, OnInit, inject } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { Member } from '../../../models/member.model';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
    selector: 'app-members-list',
    standalone: true,
    templateUrl: './members-list.component.html',
    styleUrl: './members-list.component.scss',
    imports: [MemberCardComponent]
})
export class MembersListComponent implements OnInit {
  private memberService = inject(MembersService);
  members: Member[] = [];

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: members => this.members = members
    })
  }
}