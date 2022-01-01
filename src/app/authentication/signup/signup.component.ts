import { Signup } from './signup.model';
import { AuthService } from './../auth.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const user: Signup = {
      preferredName: form.value.preferredName,
      address: form.value.address,
      socialMediaHandles: form.value.socialMediaHandles,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
      passwordConfirm: form.value.passwordConfirm,
    };

    this.authService.signup(user);
    form.resetForm();
  }
}
