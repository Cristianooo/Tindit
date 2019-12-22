import { TestBed } from '@angular/core/testing';

import { RedditDataService } from './reddit-data.service';

describe('RedditDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RedditDataService = TestBed.get(RedditDataService);
    expect(service).toBeTruthy();
  });
});
