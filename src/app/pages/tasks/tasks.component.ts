import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TaskDetailComponent } from '../../components/task-detail/task-detail.component';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LoadingService } from '../../services/loading.service';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TaskCardComponent, TaskDetailComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  selectedTask: Task | null = null;

  constructor(
    public taskService: TaskService,
    public authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private loading: LoadingService
  ) {}

  addTask() {
    // Только админ может добавлять задачи
    if (!this.authService.isAdmin()) {
      this.toast.error('Только администратор может добавлять задачи');
      return;
    }

    const title = prompt('Название задачи:');
    if (title) {
      const text = prompt('Описание задачи (опционально):');
      // Показать глобальный лоадер на небольшое время для UX
      this.loading.show();
      setTimeout(() => {
        this.taskService.addTask(title, text || '');
        this.loading.hide();
        this.toast.success('Задача добавлена');
      }, 600);
    }
  }

  openTask(id: number) {
    const task = this.taskService.getTask(id);
    if (task) {
      this.selectedTask = task;
    }
  }

  closeTaskDetail() {
    this.selectedTask = null;
  }

  saveTaskDetail(data: {title: string, text: string, image?: string}) {
    // Только админ может редактировать
    if (!this.authService.isAdmin()) {
      this.toast.error('Только администратор может редактировать задачи');
      return;
    }

    if (this.selectedTask) {
      this.loading.show();
      setTimeout(() => {
        this.taskService.updateTask(this.selectedTask!.id, data.title, data.text, data.image);
        this.selectedTask = this.taskService.getTask(this.selectedTask!.id) || null;
        this.loading.hide();
        this.toast.success('Изменения сохранены');
      }, 500);
    }
  }

  deleteTaskFromDetail() {
    // Только админ может удалять
    if (!this.authService.isAdmin()) {
      this.toast.error('Только администратор может удалять задачи');
      return;
    }

    if (this.selectedTask) {
      this.toast.confirm('Удалить эту задачу?', () => {
        this.loading.show();
        setTimeout(() => {
          this.taskService.deleteTask(this.selectedTask!.id);
          this.loading.hide();
          this.toast.success('Задача удалена');
          this.selectedTask = null;
        }, 500);
      });
    }
  }

  onRespond() {
    // Пользователи могут откликаться
    if (this.selectedTask) {
      const user = this.authService.getCurrentUser();
      this.toast.info(`Отклик на задачу "${this.selectedTask.title}" от ${user?.username}`);
      // Здесь будет логика отправки отклика
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
