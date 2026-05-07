import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-statusmessage',
  imports: [],
  templateUrl: './statusmessage.html',
})
export class Statusmessage {
  @Input({ required: true }) message: string | null = '';
  @Input() status: 'message' | 'success' | 'error' = 'message';

  private readonly baseClasses = 'rounded border px-4 py-3 text-sm';

  private readonly statusClasses: Record<Statusmessage['status'], string> = {
    message: 'border-blue-500/40 bg-blue-500/10 text-blue-200',
    success: 'border-green-500/40 bg-green-500/10 text-green-200',
    error: 'border-red-500/40 bg-red-500/10 text-red-200',
  };

  get className(): string {
    return `${this.baseClasses} ${this.statusClasses[this.status]}`;
  }
}
