import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.interface';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent {
  @Input() task: Task | null = null;
  @Input() isAdmin = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{title: string, text: string, image?: string}>();
  @Output() delete = new EventEmitter<void>();
  @Output() respond = new EventEmitter<void>();

  private toast = inject(ToastService);

  isEditing = false;
  editTitle = '';
  editText = '';
  selectedImagePreview: string | null = null;
  selectedImageFile: File | null = null;
  imageRemoved = false;
  fullscreenImage: string | null = null;
  isSaving = false;
  isDeleting = false;

  // Swipe to close
  private touchStartX = 0;
  private touchStartY = 0;
  private currentTranslateX = 0;
  private isDragging = false;

  ngOnChanges() {
    if (this.task) {
      this.editTitle = this.task.title;
      this.editText = this.task.text || '';
      this.selectedImagePreview = null;
      this.imageRemoved = false;
      this.isEditing = false;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  startEdit() {
    this.isEditing = true;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImageFile = file;
      this.imageRemoved = false;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImagePreview = null;
    this.selectedImageFile = null;
    this.imageRemoved = true;
  }

  saveEdit() {
    if (this.editTitle.trim() && !this.isSaving) {
      this.isSaving = true;
      
      const updateData: {title: string, text: string, image?: string} = {
        title: this.editTitle.trim(),
        text: this.editText.trim()
      };
      
      if (this.selectedImagePreview) {
        updateData.image = this.selectedImagePreview;
      } else if (this.imageRemoved) {
        updateData.image = '';
      }
      
      this.save.emit(updateData);
      this.isEditing = false;
      this.selectedImagePreview = null;
      this.selectedImageFile = null;
      this.imageRemoved = false;
      this.isSaving = false;
    }
  }

  cancelEdit() {
    const hasChanges = 
      this.editTitle !== this.task?.title || 
      this.editText !== (this.task?.text || '') ||
      this.selectedImageFile !== null ||
      this.imageRemoved;
    
    if (hasChanges) {
      this.toast.confirm(
        'Отменить редактирование? Все несохраненные изменения будут потеряны.',
        () => {
          if (this.task) {
            this.editTitle = this.task.title;
            this.editText = this.task.text || '';
          }
          this.isEditing = false;
          this.selectedImagePreview = null;
          this.selectedImageFile = null;
          this.imageRemoved = false;
        },
        undefined,
        'Да, отменить',
        'Продолжить'
      );
    } else {
      if (this.task) {
        this.editTitle = this.task.title;
        this.editText = this.task.text || '';
      }
      this.isEditing = false;
      this.selectedImagePreview = null;
      this.selectedImageFile = null;
      this.imageRemoved = false;
    }
  }

  onDelete() {
    if (this.isDeleting) return;
    
    this.toast.confirm(
      'Удалить эту задачу? Это действие нельзя отменить.',
      () => {
        this.isDeleting = true;
        this.delete.emit();
        this.isDeleting = false;
      },
      undefined,
      'Удалить'
    );
  }

  openImageFullscreen(imageSrc: string) {
    this.fullscreenImage = imageSrc;
  }

  closeImageFullscreen() {
    this.fullscreenImage = null;
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.isDragging = true;
  }

  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;

    const currentX = event.touches[0].clientX;
    const currentY = event.touches[0].clientY;
    const deltaX = currentX - this.touchStartX;
    const deltaY = currentY - this.touchStartY;

    // Только если свайп горизонтальный (не вертикальный скролл)
    if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
      this.currentTranslateX = deltaX;
      const modal = document.querySelector('.modal-content') as HTMLElement;
      if (modal) {
        modal.style.transform = `translateX(${deltaX}px)`;
        modal.style.transition = 'none';
      }
    }
  }

  onTouchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const modal = document.querySelector('.modal-content') as HTMLElement;
    if (modal) {
      // Если свайпнули больше чем на 100px - закрываем
      if (this.currentTranslateX > 100) {
        modal.style.transition = 'transform 0.3s ease';
        modal.style.transform = 'translateX(100%)';
        setTimeout(() => {
          this.close.emit();
        }, 300);
      } else {
        // Иначе возвращаем на место
        modal.style.transition = 'transform 0.3s ease';
        modal.style.transform = 'translateX(0)';
      }
    }

    this.currentTranslateX = 0;
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}
