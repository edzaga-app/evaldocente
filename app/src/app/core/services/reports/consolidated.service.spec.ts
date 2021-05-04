import { TestBed } from '@angular/core/testing';

import { ConsolidatedService } from './consolidated.service';

describe('ConsolidatedService', () => {
  let service: ConsolidatedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsolidatedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
