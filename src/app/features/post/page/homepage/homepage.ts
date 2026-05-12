import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GetPostService } from '../../service/get-post-service';
import { PostCard } from '../../component/post-card/post-card';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink, PostCard],
  templateUrl: './homepage.html',
})
export class Homepage implements OnInit{

  getPostApi = inject(GetPostService);

  ngOnInit(): void {
    this.getPostApi.getPosts();
  }
}
