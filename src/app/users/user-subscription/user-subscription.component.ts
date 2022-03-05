import { UserService } from 'src/app/users/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/authentication/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-subscription',
  templateUrl: './user-subscription.component.html',
  styleUrls: ['./user-subscription.component.css'],
})
export class UserSubscriptionComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  private authListenerSubs: Subscription;

  constructor(
    private authService: AuthService,
    public userService: UserService,
  ) {}
  
  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.authListenerSubs = this.authService
    .getAuthStatusListener()
    .subscribe((isAuthenticated) => {
      this.userIsAuthenticated = isAuthenticated;
      console.log(isAuthenticated);
    });
    
  }

  ngOnDestroy(): void {
   this.authListenerSubs.unsubscribe();
  }
}
