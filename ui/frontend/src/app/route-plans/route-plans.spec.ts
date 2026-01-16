import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePlans } from './route-plans';

describe('RoutePlans', () => {
  let component: RoutePlans;
  let fixture: ComponentFixture<RoutePlans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutePlans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoutePlans);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
