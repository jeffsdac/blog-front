import { Component, Input } from '@angular/core';
import { FieldTree, FormField } from "@angular/forms/signals";

@Component({
  selector: 'app-username',
  imports: [FormField],
  templateUrl: './username.html',
})
export class Username {
  @Input({ required: true }) loginField! : FieldTree<string, string>;


}
