import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Input() isAdmin = false;
  @Input() currentUser: User | null = null;
  @Output() addTask = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  menuOpen = false;

  constructor(
    public themeService: ThemeService,
    private toast: ToastService
  ) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  onLogout() {
    this.toast.confirm(
      'Вы уверены, что хотите выйти?', 
      () => {
        this.closeMenu();
        this.logout.emit();
      }, 
      undefined, 
      'Выйти',
      'Остаться'
    );
  }
}
