import { TestBed } from '@angular/core/testing';

import { DischargeService } from './discharge.service';

describe('DischargeService', () => {
  let service: DischargeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DischargeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
