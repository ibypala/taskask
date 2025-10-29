import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastComponent } from './components/toast/toast.component';
import { LoadingOverlayComponent } from './components/loading-overlay/loading-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent, LoadingOverlayComponent],
  template: '<app-toast></app-toast><app-loading-overlay></app-loading-overlay><router-outlet></router-outlet>'
})
export class AppComponent {
}