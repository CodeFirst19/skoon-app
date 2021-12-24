import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-service-edit',
  templateUrl: './service-edit.component.html',
  styleUrls: ['./service-edit.component.css'],
})
export class ServiceEditComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}