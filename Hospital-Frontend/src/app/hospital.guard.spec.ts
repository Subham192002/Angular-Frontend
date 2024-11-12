import { TestBed } from '@angular/core/testing';

import { HospitalGuard } from './hospital.guard';

describe('HospitalGuard', () => {
  let guard: HospitalGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HospitalGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
