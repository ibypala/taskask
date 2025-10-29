import { Injectable, signal } from '@angular/core';

type ToastType = 'success' | 'error' | 'info' | 'confirm';
interface Toast {
  id: number;
  message: string;
  type: ToastType;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 1;
  toasts = signal<Toast[]>([]);

  show(message: string, type: ToastType = 'info', timeout = 4000) {
    const id = this.seq++;
    const t: Toast = { id, message, type };
    this.toasts.update(list => [t, ...list]);

    if (timeout > 0) {
      setTimeout(() => this.remove(id), timeout);
    }
    return id;
  }

  success(message: string, timeout = 4000) {
    return this.show(message, 'success', timeout);
  }

  error(message: string, timeout = 6000) {
    return this.show(message, 'error', timeout);
  }

  info(message: string, timeout = 4000) {
    return this.show(message, 'info', timeout);
  }

  confirm(message: string, onConfirm: () => void, onCancel?: () => void) {
    const id = this.seq++;
    const t: Toast = { 
      id, 
      message, 
      type: 'confirm',
      onConfirm: () => {
        this.remove(id);
        onConfirm();
      },
      onCancel: () => {
        this.remove(id);
        if (onCancel) onCancel();
      }
    };
    this.toasts.update(list => [t, ...list]);
    return id;
  }

  remove(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }
}
