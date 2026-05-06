import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-statusmessage',
  imports: [],
  templateUrl: './statusmessage.html',
})
export class Statusmessage implements OnInit{

  @Input( { required: true } ) message : string | null = "";
  @Input() status = "message";   
  protected nameClass = "";

  ngOnInit(): void {
    
    let initialColor = ""
    if (this.status === "message") initialColor = "blue";
    if ( this.status === "success" ) initialColor = "green";
    if ( this.status === "error" ) initialColor = "red";

    this.nameClass = `rounded border border-${initialColor}-500/40 bg-${initialColor}-500/10 px-4 py-3 text-sm text-${initialColor}-200`;

  }

}
