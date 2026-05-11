import { TestBed } from '@angular/core/testing';

import { GetPostApiService } from './get-post-api-service';

describe('GetPostService', () => {
  let service: GetPostApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetPostApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
