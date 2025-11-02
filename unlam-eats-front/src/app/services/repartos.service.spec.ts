import { TestBed } from '@angular/core/testing';

import { RepartosService } from './repartos.service';

describe('Repartos', () => {
  let service: RepartosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepartosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
