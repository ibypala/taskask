import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-task-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-add.component.html',
  styleUrls: ['./task-add.component.css']
})
export class TaskAddComponent {
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{title: string, text: string, image?: string}>();

  private toast = inject(ToastService);

  title = '';
  text = '';
  selectedImagePreview: string | null = 'images/task_default.png';
  selectedImageFile: File | null = null;
  isSaving = false;

  // Swipe to close
  private touchStartX = 0;
  private touchStartY = 0;
  private currentTranslateX = 0;
  private isDragging = false;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedImagePreview = 'images/task_default.png';
    this.selectedImageFile = null;
  }

  onSave() {
    if (this.title.trim() && !this.isSaving) {
      this.isSaving = true;
      
      const data: {title: string, text: string, image?: string} = {
        title: this.title.trim(),
        text: this.text.trim()
      };
      
      if (this.selectedImagePreview) {
        data.image = this.selectedImagePreview;
      }
      
      this.save.emit(data);
      this.close.emit();
      this.isSaving = false;
    }
  }

  onCancel() {
    const hasChanges = this.title.trim() || this.text.trim() || this.selectedImageFile;
    
    if (hasChanges) {
      this.toast.confirm(
        'Отменить создание задачи? Введенные данные будут потеряны.',
        () => {
          this.close.emit();
        },
        undefined,
        'Да, отменить',
        'Продолжить'
      );
    } else {
      this.close.emit();
    }
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
      const modal = document.querySelector('.modal') as HTMLElement;
      if (modal) {
        modal.style.transform = `translateX(${deltaX}px)`;
        modal.style.transition = 'none';
      }
    }
  }

  onTouchEnd() {
    if (!this.isDragging) return;
    this.isDragging = false;

    const modal = document.querySelector('.modal') as HTMLElement;
    if (modal) {
      // Если свайпнули больше чем на 100px - проверяем изменения
      if (this.currentTranslateX > 100) {
        modal.style.transition = 'transform 0.3s ease';
        modal.style.transform = 'translateX(100%)';
        
        const hasChanges = this.title.trim() || this.text.trim() || this.selectedImageFile;
        if (hasChanges) {
          // Возвращаем модалку и показываем подтверждение
          setTimeout(() => {
            modal.style.transform = 'translateX(0)';
          }, 100);
          this.onCancel();
        } else {
          // Закрываем сразу
          setTimeout(() => {
            this.close.emit();
          }, 300);
        }
      } else {
        // Иначе возвращаем на место
        modal.style.transition = 'transform 0.3s ease';
        modal.style.transform = 'translateX(0)';
      }
    }

    this.currentTranslateX = 0;
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}
