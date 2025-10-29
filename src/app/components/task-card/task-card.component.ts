import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  @Input() id!: number;
  @Input() title = '';
  @Input() text = '';
  @Input() image = '';
  
  @Output() cardClick = new EventEmitter<number>();

  onClick() {
    this.cardClick.emit(this.id);
  }
}
