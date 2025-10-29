import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public themeService: ThemeService
  ) {}

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Введите логин и пароль';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    // Симуляция задержки запроса
    setTimeout(() => {
      const success = this.authService.login(this.username, this.password);
      
      if (success) {
        // Получаем URL для возврата или идем на главную
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      } else {
        this.errorMessage = 'Неверный логин или пароль';
        this.isLoading = false;
      }
    }, 500);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  getDemoCredentials(): string {
    return 'Демо: admin/admin123 или user/user123';
  }
}
