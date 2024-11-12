import { TestBed } from '@angular/core/testing';

import { HospitalInterceptor } from './hospital.interceptor';

describe('HospitalInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HospitalInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HospitalInterceptor = TestBed.inject(HospitalInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
