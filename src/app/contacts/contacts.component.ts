import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Enquiry {
  name: string;
  email: string;
  subject: string;
  message: string;
}

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css'],
})
export class ContactsComponent implements OnInit {
  isLoading: boolean = false;
  successMessage: string;
  errorMessage: string;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  onEnquire(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    const enquiry: Enquiry = {
      name: form.value.name,
      email: form.value.email,
      subject: form.value.subject,
      message: form.value.message,
    };

    this.sendEnquiry(enquiry);
    form.resetForm();
  }

  sendEnquiry(enquiry: Enquiry) {
    this.http
      .post<{ status: string; message: string }>(
        'http://localhost:3000/api/v1/enquiry',
        enquiry
      )
      .subscribe(
        (response) => {
          this.isLoading = false;
          this.successMessage = response.message;
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = error.error.message;
        }
      );
  }
}
