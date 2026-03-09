import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentDetailsComponent } from './shipment-details.component';

describe('ShipmentDetailsComponent', () => {
  let component: ShipmentDetailsComponent;
  let fixture: ComponentFixture<ShipmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShipmentDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShipmentDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
