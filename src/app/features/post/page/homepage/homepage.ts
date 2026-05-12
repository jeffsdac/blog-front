import { Component, inject, OnInit } from '@angular/core';
import { Header } from '../../../../shared/header/header';
import { GetPostService } from '../../service/get-post-service';
import { PostCard } from '../../component/post-card/post-card';
import { Sidebar } from '../../../../shared/sidebar/sidebar';

@Component({
  selector: 'app-homepage',
  imports: [Header, Sidebar, PostCard],
  templateUrl: './homepage.html',
})
export class Homepage implements OnInit{

  getPostApi = inject(GetPostService);

  ngOnInit(): void {
    this.getPostApi.getPosts();
  }
}
