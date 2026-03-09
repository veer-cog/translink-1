import { TestBed } from '@angular/core/testing';

import { HubApiService } from './hub-api.service';

describe('HubApiService', () => {
  let service: HubApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
