import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookShipmenComponent } from './book-shipmen.component';

describe('BookShipmenComponent', () => {
  let component: BookShipmenComponent;
  let fixture: ComponentFixture<BookShipmenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookShipmenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookShipmenComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
