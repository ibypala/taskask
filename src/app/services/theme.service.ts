import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.darkMode.asObservable();

  constructor() {
    // Загрузка сохраненной темы из localStorage
    const savedTheme = localStorage.getItem('theme');
    const isDark = savedTheme === 'dark';
    this.darkMode.next(isDark);
    this.applyTheme(isDark);
  }

  toggleTheme() {
    const newValue = !this.darkMode.value;
    this.darkMode.next(newValue);
    this.applyTheme(newValue);
  }

  private applyTheme(isDark: boolean) {
    const root = document.documentElement;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#212529');
      }
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#ffffff');
      }
    }
  }

  get currentTheme() {
    return this.darkMode.value ? 'dark' : 'light';
  }
}
