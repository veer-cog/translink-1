import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteAnalysisComponent } from './route-analysis.component';

describe('RouteAnalysisComponent', () => {
  let component: RouteAnalysisComponent;
  let fixture: ComponentFixture<RouteAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RouteAnalysisComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
