import { TestBed } from '@angular/core/testing';

import { BedWardService } from './bed-ward.service';

describe('BedWardService', () => {
  let service: BedWardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BedWardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
