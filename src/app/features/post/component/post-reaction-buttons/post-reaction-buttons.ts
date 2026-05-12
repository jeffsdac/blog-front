import { Component, Input } from '@angular/core';

export type PostReactionButtonsVariant = 'pill' | 'text';

@Component({
  selector: 'app-post-reaction-buttons',
  templateUrl: './post-reaction-buttons.html',
})
export class PostReactionButtons {
  @Input({ required: true }) postId!: string;
  @Input({ required: true }) likes!: number;
  @Input({ required: true }) unlikes!: number;
  @Input() variant: PostReactionButtonsVariant = 'pill';

  like(event: MouseEvent): void {
    event.stopPropagation();
  }

  unlike(event: MouseEvent): void {
    event.stopPropagation();
  }
}
