import { Injectable, signal } from '@angular/core';

export interface ToastAction {
  label: string;
  route: string;
}

export type ToastType = 'success' | 'error';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly message = signal<string>('');
  readonly visible = signal<boolean>(false);
  readonly action = signal<ToastAction | undefined>(undefined);
  readonly type = signal<ToastType>('success');
  private timer: ReturnType<typeof setTimeout> | undefined = undefined;

  show(message: string, action?: ToastAction, duration = 4000, type: ToastType = 'success'): void {
    if (this.timer) clearTimeout(this.timer);
    this.message.set(message);
    this.action.set(action);
    this.type.set(type);
    this.visible.set(true);
    this.timer = setTimeout(() => this.visible.set(false), duration);
  }

  hide(): void {
    if (this.timer) clearTimeout(this.timer);
    this.visible.set(false);
  }
}
