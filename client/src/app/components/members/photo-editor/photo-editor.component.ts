import {Component, OnInit, inject, input, output} from '@angular/core';
import { IMember } from '../../../models/member.model';
import { DecimalPipe, NgClass, NgStyle } from '@angular/common';
import { FileUploadModule, FileUploader } from 'ng2-file-upload';
import { AccountService } from '../../../services/account.service';
import { environment } from '../../../../environments/environment';
import { IPhoto } from '../../../models/photo.model';
import { MembersService } from '../../../services/members.service';

@Component({
  selector: 'app-photo-editor',
  standalone: true,
  imports: [NgStyle, NgClass, FileUploadModule, DecimalPipe],
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss'
})
export class PhotoEditorComponent implements OnInit {
  private accountService = inject(AccountService);
  private membersService = inject(MembersService);
  member = input.required<IMember>();
  uploader?: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  memberChange = output<IMember>();

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any) {
    this.hasBaseDropZoneOver = e;
  }

  deletePhoto(photo: IPhoto) {
    this.membersService.deletePhoto(photo).subscribe({
      next: _ => {
        const updatedMember = {...this.member()};
        updatedMember.photos = updatedMember.photos.filter(x => x.id !== photo.id);
        this.memberChange.emit(updatedMember);
      }
    })
  }

  setMainPhoto(photo: IPhoto) {
    this.membersService.setMainPhoto(photo).subscribe({
      next: _ => {
        const user = this.accountService.currentUser();
        if (user) {
          user.photoUrl = photo.url;
          this.accountService.setCurrentUser(user)
        }
        const updatedMember = {...this.member()}
        updatedMember.photoUrl = photo.url;
        updatedMember.photos.forEach(p => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });
        this.memberChange.emit(updatedMember)
      }
    })
  }

  initializeUploader() {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}/users/add-photo`,
      authToken: 'Bearer ' + this.accountService.currentUser()?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      const photo = JSON.parse(response);
      const updatedMember = {...this.member()}
      updatedMember.photos.push(photo);
      this.memberChange.emit(updatedMember);
      if (photo.isMain) {
        const user = this.accountService.currentUser();
        if (user) {
          user.photoUrl = photo.url;
          this.accountService.setCurrentUser(user)
        }
        updatedMember.photoUrl = photo.url;
        updatedMember.photos.forEach(p => {
          if (p.isMain) p.isMain = false;
          if (p.id === photo.id) p.isMain = true;
        });
        this.memberChange.emit(updatedMember)
      }
    }
  }

}