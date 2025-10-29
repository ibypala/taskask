import { Injectable, signal } from '@angular/core';
import { Task } from '../models/task.interface';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks = signal<Task[]>([
    {
      id: 1,
      title: 'Создать дизайн лендинга',
      text: 'Разработать современный дизайн одностраничного сайта для стартапа. Нужны макеты для desktop и mobile версий.',
      image: 'images/task_default.png',
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'Настроить рекламу в соцсетях',
      text: 'Запустить таргетированную рекламу в ВКонтакте и Instagram. Целевая аудитория: мужчины и женщины 25-45 лет, интересующиеся фитнесом.',
      image: 'images/task_default.png',
      createdAt: new Date()
    },
    {
      id: 3,
      title: 'Написать статьи для блога',
      text: 'Подготовить 5 SEO-оптимизированных статей по тематике здорового питания. Объем каждой статьи: 3000-4000 символов.',
      image: 'images/task_default.png',
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
      image: image || 'images/task_default.png',
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
}
