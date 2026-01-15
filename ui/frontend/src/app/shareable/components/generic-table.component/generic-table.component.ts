import { Component, input, contentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'badge' | 'date'; // Define types for special rendering
}

@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-table.component.html',
  styleUrl: './generic-table.component.scss'
})
export class GenericTableComponent {
  title = input<string>('Recent Data');
  columns = input.required<TableColumn[]>();
  data = input.required<any[]>();
  
  customCell = contentChild<TemplateRef<any>>('customCell');

  getStatusClass(value: string): string {
    return value.toLowerCase().replace(/\s+/g, '-');
  }
}