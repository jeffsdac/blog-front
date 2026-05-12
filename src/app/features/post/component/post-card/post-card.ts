import { Component, Input } from '@angular/core';
import { PostReactionButtons } from '../post-reaction-buttons/post-reaction-buttons';

@Component({
  selector: 'app-post-card',
  imports: [PostReactionButtons],
  templateUrl: './post-card.html',
})
export class PostCard {
  @Input({ required: true }) postId!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) content!: string;
  @Input({ required: true }) likes!: number;
  @Input({ required: true }) unlikes!: number;
}
