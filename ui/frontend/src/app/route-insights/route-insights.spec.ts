import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteInsights } from './route-insights';

describe('RouteInsights', () => {
  let component: RouteInsights;
  let fixture: ComponentFixture<RouteInsights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteInsights]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteInsights);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
