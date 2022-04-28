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
  
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  
}
