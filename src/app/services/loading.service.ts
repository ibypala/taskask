import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private counter = signal(0);
  isLoading = computed(() => this.counter() > 0);

  show() {
    this.counter.update(n => n + 1);
  }

  hide() {
    this.counter.update(n => Math.max(0, n - 1));
  }
}
