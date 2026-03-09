import { Component, input, output, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab-filter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pill-track">
      @for (tab of tabs(); track tab) {
        <button 
          type="button"
          class="pill-item" 
          [class.active]="activeTab() === tab"
          (click)="selectTab(tab)">
          {{ tab }}
        </button>
      }
    </div>
  `,
  styleUrl: './tab-filter.component.scss'
})
export class TabFilterComponent implements OnInit {
  tabs = input.required<string[]>();
  tabChanged = output<string>();
  
  // Signal to track the UI state
  activeTab = signal<string>('');

  ngOnInit() {
    // Automatically set the first tab as active on load
    const initialTabs = this.tabs();
    if (initialTabs && initialTabs.length > 0) {
      const firstTab = initialTabs[0];
      this.activeTab.set(firstTab);
      // We don't necessarily need to emit here if the parent 
      // already defaults its 'view' variable to the same value.
    }
  }

  selectTab(tab: string) {
    this.activeTab.set(tab);
    this.tabChanged.emit(tab);
  }
}