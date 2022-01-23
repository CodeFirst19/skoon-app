import { Subscription } from 'rxjs';
import { AuthService } from './../../authentication/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  userIsAdmin: boolean = false;
  role: string;
  private authListenerSubs: Subscription;
  private isAdminListenerSubs: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.userIsAdmin = role === 'admin' ? true : false;
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.isAdminListenerSubs = this.authService.getIsAdminListener()
      .subscribe((isAdmin) => {
        this.userIsAdmin = isAdmin;
      });
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  public onToggleSidenav = () => {};

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.isAdminListenerSubs.unsubscribe();
  }
}
