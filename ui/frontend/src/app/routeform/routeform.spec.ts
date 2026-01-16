import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Routeform } from './routeform';

describe('Routeform', () => {
  let component: Routeform;
  let fixture: ComponentFixture<Routeform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Routeform]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Routeform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
