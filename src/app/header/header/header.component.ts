import { Subscription } from 'rxjs';
import { AuthService } from './../../authentication/auth.service';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

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

  isLoading: boolean;
  @Output() loader = new EventEmitter<boolean>();

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = localStorage.getItem('role');
    this.userIsAdmin = role === 'admin' ? true : false;
    this.userIsAuthenticated = this.authService.getIsAuthenticated();
    this.isAdminListenerSubs = this.authService
      .getIsAdminListener()
      .subscribe((isAdmin) => {
        this.userIsAdmin = isAdmin;
      });
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.isLoading = true;
    this.loader.emit(this.isLoading);
    setTimeout(() => {
      this.isLoading = false
      this.loader.emit(this.isLoading);
      this.authService.logout();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.isAdminListenerSubs.unsubscribe();
  }
}
