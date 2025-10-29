import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      // Проверяем роль если указана в route data
      const requiredRole = route.data['role'];
      if (requiredRole && !this.authService.hasRole(requiredRole)) {
        // Нет доступа - редирект на главную
        this.router.navigate(['/']);
        return false;
      }
      return true;
    }

    // Не авторизован - редирект на логин
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
