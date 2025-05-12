import { Component, OnInit, inject } from '@angular/core';
import { MembersService } from '../../../services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-members-list',
    standalone: true,
    templateUrl: './members-list.component.html',
    styleUrl: './members-list.component.scss',
    imports: [MemberCardComponent, PaginationModule, FormsModule, ButtonsModule]
})
export class MembersListComponent implements OnInit {
  membersService = inject(MembersService);
  genders = [{ value: 'male', display: 'Males' }, { value: 'female', display: 'Females' }];

  ngOnInit(): void {
    if (!this.membersService.membersList()) {
      this.loadMembers();
    }
  }

  loadMembers() {
    this.membersService.getMembers();
  }

  resetFilters() {
    this.membersService.resetUserParams();
    this.loadMembers();
  }
  
  pageChanged(event: any) {
    if (this.membersService.userParams().pageNumber != event.page) {
      this.membersService.userParams().pageNumber = event.page;
      this.loadMembers();
    }
  }
}