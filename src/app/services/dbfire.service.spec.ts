import { TestBed } from '@angular/core/testing';

import { DbfireService } from './dbfire.service';

describe('DbfireService', () => {
  let service: DbfireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbfireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
