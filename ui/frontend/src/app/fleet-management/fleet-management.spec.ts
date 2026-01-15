import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetManagement } from './fleet-management';

describe('FleetManagement', () => {
  let component: FleetManagement;
  let fixture: ComponentFixture<FleetManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FleetManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FleetManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
