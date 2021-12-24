import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PaymentCreateComponent } from './payments/payment-create/payment-create.component';
import { HeaderComponent } from './header/header/header.component';
import { PaymentListComponent } from './payments/payment-list/payment-list.component';
import { ServiceListComponent } from './service-requests/service-list/service-list.component';
import { ServiceCreateComponent } from './service-requests/service-create/service-create.component';
import { UserListComponent } from './users/user-list/user-list.component';
import { LoginComponent } from './authentication/login/login/login.component';
import { ServiceViewComponent } from './service-requests/service-view/service-view.component';
import { ServiceEditComponent } from './service-requests/service-edit/service-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    PaymentCreateComponent,
    HeaderComponent,
    PaymentListComponent,
    ServiceListComponent,
    ServiceCreateComponent,
    UserListComponent,
    LoginComponent,
    ServiceViewComponent,
    ServiceEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    MatDividerModule,
    MatDialogModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
