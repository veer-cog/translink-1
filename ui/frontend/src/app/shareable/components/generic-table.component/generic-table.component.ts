import { Component, input, contentChild, TemplateRef, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'badge' | 'date' | 'priority' | 'action'; 
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
  
  // This looks for <ng-template #rowActions> in the parent
  rowActionsTemplate = contentChild<TemplateRef<any>>('rowActions');

  getStatusClass(value: string): string {
    if (!value) return '';
    return value.toLowerCase().replace(/\s+/g, '-');
  }
}