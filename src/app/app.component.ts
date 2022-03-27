import { AuthService } from './authentication/auth.service';
import { ServiceRequest } from './service-requests/service-requests.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}
  isLoading = false;

  ngOnInit(): void {
    this.authService.autoAuthUser();
  }

  onLogoutLoader(isLoading: boolean) {
    this.isLoading = isLoading;
  }
}
