import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHubComponent } from './add-hub.component';

describe('AddHubComponent', () => {
  let component: AddHubComponent;
  let fixture: ComponentFixture<AddHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHubComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
