import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetManagementComponent } from './fleet-management.component';

describe('FleetManagementComponent', () => {
  let component: FleetManagementComponent;
  let fixture: ComponentFixture<FleetManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FleetManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
