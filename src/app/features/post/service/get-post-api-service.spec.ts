import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { IPublicPostDTO } from '../model/ipublic-post-dto';
import { PageResponseDTO } from '../model/page-response-dto';
import { GetPostApiService } from './get-post-api-service';

describe('GetPostApiService', () => {
  let service: GetPostApiService;
  let httpMock: HttpTestingController;

  const response: PageResponseDTO<IPublicPostDTO> = {
    items: [
      {
        id: 'post-1',
        title: 'Post 1',
        content: 'Content 1',
        authorId: 'author-1',
        authorUsername: 'jeffsdac',
        likeVotes: 10,
        unlikeVotes: 1,
        createdAt: new Date('2026-05-11T10:00:00.000Z'),
      },
    ],
    limit: 10,
    offset: 0,
    total: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(GetPostApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('requests posts with default limit and offset', () => {
    service.getPosts().subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/posts?limit=10&offset=0');
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('requests posts with provided limit and offset', () => {
    service.getPosts(20, 10).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/posts?limit=20&offset=10');
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('requests posts with minimum limit and zero offset', () => {
    service.getPosts(1, 0).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/posts?limit=1&offset=0');
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('requests posts with max allowed limit', () => {
    service.getPosts(20, 0).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/posts?limit=20&offset=0');
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });

  it('keeps high offset in query params', () => {
    service.getPosts(10, 100).subscribe((data) => {
      expect(data).toEqual(response);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/v1/posts?limit=10&offset=100');
    expect(req.request.method).toBe('GET');
    req.flush(response);
  });
});
