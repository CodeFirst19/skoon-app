import { Signup } from './signup.model';
import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  socialProfiles: string[] = [];

  isLoading: boolean = false;
  private isLoadingSubscription: Subscription;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.isLoadingSubscription = this.authService
      .getIsLoadingListener()
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
      });
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

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const user: Signup = {
      preferredName: form.value.preferredName,
      address: form.value.address,
      socialMediaHandles: this.socialProfiles,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
      passwordConfirm: form.value.passwordConfirm,
    };

    this.authService.signup(user);
    form.resetForm();
  }

  ngOnDestroy(): void {
    this.isLoadingSubscription.unsubscribe();
  }
}
