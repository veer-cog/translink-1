import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogMaintenanceComponent } from './log-maintenance.component';

describe('LogMaintenanceComponent', () => {
  let component: LogMaintenanceComponent;
  let fixture: ComponentFixture<LogMaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogMaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogMaintenanceComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
