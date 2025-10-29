import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../models/task.interface';

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

  isEditing = false;
  editTitle = '';
  editText = '';
  selectedImagePreview: string | null = null;
  selectedImageFile: File | null = null;
  imageRemoved = false;
  fullscreenImage: string | null = null;

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
    if (this.editTitle.trim()) {
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
    }
  }

  cancelEdit() {
    if (this.task) {
      this.editTitle = this.task.title;
      this.editText = this.task.text || '';
    }
    this.isEditing = false;
    this.selectedImagePreview = null;
    this.selectedImageFile = null;
    this.imageRemoved = false;
  }

  onDelete() {
    this.delete.emit();
  }

  openImageFullscreen(imageSrc: string) {
    this.fullscreenImage = imageSrc;
  }

  closeImageFullscreen() {
    this.fullscreenImage = null;
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}
