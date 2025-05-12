import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { IMember } from '../models/member.model';
import { MembersService } from '../services/members.service';

export const memberDetailedResolver: ResolveFn<IMember | null> = (route, state) => {
  const membersService = inject(MembersService);

  const username = route.paramMap.get('username');

  if (!username) return null;

  return membersService.getMember(username);
};