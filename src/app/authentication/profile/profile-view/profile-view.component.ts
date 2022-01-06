import { UserService } from './../../../users/user.service';
import { User } from './../../../users/user.model';
import { AuthService } from 'src/app/authentication/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.css'],
})
export class ProfileViewComponent implements OnInit {
  user: User;
  private userListenerSubs: Subscription;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    this.userService.getUser(userId);
    this.userListenerSubs = this.userService.getUserUpdateListener()
    .subscribe((user) => {
      this.user = user;
      // this.user = null;
      console.log(this.user)
    })
  }
}
