import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = signal<Task[]>([
    {
      id: 1,
      title: 'Разработка мобильного приложения',
      text: `Требуется разработать мобильное приложение для iOS и Android с современным интерфейсом и удобной навигацией.

Основные требования:
• Кроссплатформенная разработка (React Native/Flutter)
• Интеграция с REST API
• Push-уведомления
• Авторизация через социальные сети
• Работа в офлайн-режиме

Дизайн:
Предоставим макеты в Figma. Необходимо строгое следование гайдлайнам iOS/Android.

Сроки: 2-3 месяца
Бюджет: обсуждается

Откликайтесь с портфолио и примерами похожих проектов.`,
      image: '/images/task_default.png',
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'Дизайн корпоративного сайта',
      text: `Ищем талантливого UI/UX дизайнера для создания современного корпоративного сайта.

Что нужно:
• Разработка концепции и прототипа
• Дизайн главной и 5-7 внутренних страниц
• Адаптивная версия (desktop, tablet, mobile)
• UI-kit и гайдлайны

Стиль: минимализм, современный, профессиональный
Референсы предоставим

Важно: опыт работы с Figma, понимание веб-стандартов`,
      image: '/images/task_default.png',
      createdAt: new Date()
    },
    {
      id: 3,
      title: 'SEO-продвижение интернет-магазина',
      text: `Требуется специалист по SEO для продвижения интернет-магазина электроники.

Задачи:
• Технический аудит сайта
• Сбор и кластеризация семантического ядра
• Оптимизация страниц
• Наращивание ссылочной массы
• Ежемесячная отчетность

Требования:
✓ Опыт работы от 2 лет
✓ Кейсы в e-commerce
✓ Знание Яндекс.Метрики и Google Analytics

Оплата: ежемесячно по результатам`,
      image: '/images/task_default.png',
      createdAt: new Date()
    }
  ]);

  // Публичный read-only signal
  readonly allTasks = this.tasks.asReadonly();

  addTask(title: string, text?: string, image?: string): void {
    const newTask: Task = {
      id: Date.now(),
      title,
      text,
      image,
      createdAt: new Date()
    };
    this.tasks.update(tasks => [...tasks, newTask]);
  }

  deleteTask(id: number): void {
    this.tasks.update(tasks => tasks.filter(task => task.id !== id));
  }

  updateTask(id: number, title: string, text?: string, image?: string): void {
    this.tasks.update(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, title, text, ...(image !== undefined && { image }) } : task
      )
    );
  }

  getTask(id: number): Task | undefined {
    return this.tasks().find(task => task.id === id);
  }
}
