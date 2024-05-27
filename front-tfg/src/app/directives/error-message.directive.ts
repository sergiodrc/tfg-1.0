import { Directive, Input, HostBinding } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appErrorMessage]'
})
export class ErrorMessageDirective {
    @Input('appErrorMessage') errorMessage: string;
  
    constructor(private control: NgControl) {
      this.errorMessage = '';
    }
  
    @HostBinding('innerText')
    get errorMessageVisible() {
      const control = this.control.control;
      return control && control.invalid && control.dirty ? this.errorMessage : '';
    }
  }
  