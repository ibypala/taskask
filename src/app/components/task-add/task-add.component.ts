import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  title = '';
  text = '';
  selectedImagePreview: string | null = 'images/task_default.png';
  selectedImageFile: File | null = null;

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
    if (this.title.trim()) {
      const data: {title: string, text: string, image?: string} = {
        title: this.title.trim(),
        text: this.text.trim()
      };
      
      if (this.selectedImagePreview) {
        data.image = this.selectedImagePreview;
      }
      
      this.save.emit(data);
      this.close.emit();
    }
  }

  onCancel() {
    this.close.emit();
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}
