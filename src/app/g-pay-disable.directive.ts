import { Directive, ElementRef, Input } from '@angular/core';
import { interval } from 'rxjs';

@Directive({
  selector: '[gpayDisabled]',
})
export class GPayDisableDirective {
  @Input() gpayDisabled = false;
  constructor(el: ElementRef) {
    const btnTimer = interval(200).subscribe(() => {
      let gPayButton = el.nativeElement.querySelector(
        '.gpay-card-info-container'
      );
      if (gPayButton) {
        gPayButton.disabled = this.gpayDisabled;
        if (this.gpayDisabled) {
          gPayButton.style.opacity = 0.5;
        }
        btnTimer.unsubscribe();
      }
    });
  }
}
