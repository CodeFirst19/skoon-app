import { ProfileEditComponent } from './../profile-edit/profile-edit.component';
import { UserService } from './../../../users/user.service';
import { User } from './../../../users/user.model';
import { AuthService } from 'src/app/authentication/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css'],
})
export class ProfileViewComponent implements OnInit, OnDestroy {
  user: User;
  private userListenerSubs: Subscription;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.userService.getUser(userId);
    this.userListenerSubs = this.userService
      .getUserUpdateListener()
      .subscribe((user) => {
        this.user = user;
        // this.user = null;
        console.log(this.user)
      });
  }

  onEditProfileDialog(user): void {
    this.dialog.open(ProfileEditComponent, {
      autoFocus: false,
      width: '45%',
      data: user,
    });
  }

  onDeleteUserAccount() {
    this.userService.deleteMe()
  }

  ngOnDestroy(): void {
    this.userListenerSubs.unsubscribe()
  }
}
