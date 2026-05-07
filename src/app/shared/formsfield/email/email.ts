import { Component, Input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-email',
  imports: [FormField],
  templateUrl: './email.html',
})
export class Email {

  @Input( { required: true } ) emailField! : FieldTree<string, string >

}
