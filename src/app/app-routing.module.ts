import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ServiceListComponent } from './service-requests/service-list/service-list.component';
import { ServiceCreateComponent } from './service-requests/service-create/service-create.component';

const routes: Routes = [
  { path: 'view-services', component: ServiceListComponent },
  { path: 'request-service', component: ServiceCreateComponent },
  { path: 'view-service', component: ServiceCreateComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
