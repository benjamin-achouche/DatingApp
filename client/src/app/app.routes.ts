import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MembersListComponent } from './components/members/members-list/members-list.component';
import { MembersItemComponent } from './components/members/members-item/members-item.component';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/messages.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'members', component: MembersListComponent, canActivate: [authGuard] },
  { path: 'members/:id', component: MembersItemComponent, canActivate: [authGuard] },
  { path: 'lists', component: ListsComponent, canActivate: [authGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [authGuard] },
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];
