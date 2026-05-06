import { Component, Input } from '@angular/core';
import { FieldTree, FormField } from '@angular/forms/signals';

@Component({
  selector: 'app-password',
  imports: [FormField],
  templateUrl: './password.html',
})
export class Password {

  @Input({ required: true }) passwordField! : FieldTree<string, string>;
  @Input() label : string = "Senha"

}
