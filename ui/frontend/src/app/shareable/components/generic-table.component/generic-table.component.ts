import { Component, input, contentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

// src/app/shareable/components/generic-table.component/generic-table.component.ts

export interface TableColumn {
  field: string;
  header: string;
  // Update this list to include every type used in your ngIf statements
  type?: 'text' | 'badge' | 'date' | 'priority' | 'customer' | 'action'; 
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
    if (!value) return '';
    return value.toLowerCase().replace(/\s+/g, '-');
  }
}