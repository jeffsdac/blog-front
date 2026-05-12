import { Component } from '@angular/core';
import { PostReactionButtons } from '../../component/post-reaction-buttons/post-reaction-buttons';

@Component({
  selector: 'app-post-details',
  imports: [PostReactionButtons],
  templateUrl: './post-details.html',
})
export class PostDetails {}
