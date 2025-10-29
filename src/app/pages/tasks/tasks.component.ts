import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { TaskCardComponent } from '../../components/task-card/task-card.component';
import { TaskDetailComponent } from '../../components/task-detail/task-detail.component';
import { TaskAddComponent } from '../../components/task-add/task-add.component';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LoadingService } from '../../services/loading.service';
import { Task } from '../../models/task.interface';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TaskCardComponent, TaskDetailComponent, TaskAddComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {
  selectedTask: Task | null = null;
  showAddModal = false;

  constructor(
    public taskService: TaskService,
    public authService: AuthService,
    private router: Router,
    private toast: ToastService,
    private loading: LoadingService
  ) {}

  addTask() {
    if (!this.authService.isAdmin()) {
      this.toast.error('Только администратор может добавлять задачи');
      return;
    }

    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  saveNewTask(data: {title: string, text: string, image?: string}) {
    this.taskService.addTask(data.title, data.text, data.image);
    this.toast.success('Задача добавлена');
    this.showAddModal = false;
  }

  openTask(id: number) {
    const task = this.taskService.allTasks().find(t => t.id === id);
    if (task) {
      this.selectedTask = task;
    }
  }

  closeTaskDetail() {
    this.selectedTask = null;
  }

  saveTaskDetail(data: {title: string, text: string, image?: string}) {
    if (!this.authService.isAdmin()) {
      this.toast.error('Только администратор может редактировать задачи');
      return;
    }

    if (this.selectedTask) {
      this.taskService.updateTask(this.selectedTask.id, data.title, data.text, data.image);
      this.selectedTask = this.taskService.allTasks().find(t => t.id === this.selectedTask!.id) || null;
      this.toast.success('Изменения сохранены');
    }
  }

  deleteTaskFromDetail() {
    if (!this.authService.isAdmin()) {
      this.toast.error('Только администратор может удалять задачи');
      return;
    }

    if (this.selectedTask) {
      this.toast.confirm('Удалить эту задачу?', () => {
        this.taskService.deleteTask(this.selectedTask!.id);
        this.toast.success('Задача удалена');
        this.selectedTask = null;
      });
    }
  }

  onRespond() {
    if (this.selectedTask) {
      const user = this.authService.getCurrentUser();
      this.toast.info(`Отклик на задачу "${this.selectedTask.title}" от ${user?.username}`);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
