import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../../../shared/header/header';
import { Sidebar } from '../../../../shared/sidebar/sidebar';

@Component({
  selector: 'app-post-layout',
  imports: [Header, Sidebar, RouterOutlet],
  templateUrl: './post-layout.html',
})
export class PostLayout {}
