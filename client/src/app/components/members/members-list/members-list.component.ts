import { Component, OnInit, inject } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
    selector: 'app-members-list',
    standalone: true,
    templateUrl: './members-list.component.html',
    styleUrl: './members-list.component.scss',
    imports: [MemberCardComponent]
})
export class MembersListComponent implements OnInit {
  memberService = inject(MembersService);

  ngOnInit(): void {
    if (this.memberService.members().length === 0) this.loadMembers();
  }

  loadMembers() {
    this.memberService.getMembers()
  }
}