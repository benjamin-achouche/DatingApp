import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss'
})
export class NavComponent {

  accountService = inject(AccountService);
  toastr = inject(ToastrService);
  private router = inject(Router);
  
  model: any = {};

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => this.router.navigateByUrl("/members"),
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl("/");
  }

}
