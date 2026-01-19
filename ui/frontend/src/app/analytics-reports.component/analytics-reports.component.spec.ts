import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsReportsComponent } from './analytics-reports.component';

describe('AnalyticsReportsComponent', () => {
  let component: AnalyticsReportsComponent;
  let fixture: ComponentFixture<AnalyticsReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsReportsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
