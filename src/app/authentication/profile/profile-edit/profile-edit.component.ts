import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/users/user.model';
import { UserService } from 'src/app/users/user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  socialProfiles: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProfileEditComponent>,
    @Inject(MAT_DIALOG_DATA) public user: User,
     private userService: UserService
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.socialProfiles = this.user.socialMediaHandles;
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.socialProfiles.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(profile): void {
    const index = this.socialProfiles.indexOf(profile);

    if (index >= 0) {
      this.socialProfiles.splice(index, 1);
    }
  }

  onEditProfile(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // console.log(form.value)
    // console.log(this.socialProfiles);
     const user: {} = {
       preferredName: form.value.preferredName,
       address: form.value.address,
       socialMediaHandles: this.socialProfiles,
       email: form.value.email,
       phone: form.value.phone,
     };
    console.log(form.value.phone);
    this.userService.updateMe(user);
    form.resetForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
