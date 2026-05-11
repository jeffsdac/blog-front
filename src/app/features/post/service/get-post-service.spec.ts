import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EMPTY, Observable, Subject, defer, of } from 'rxjs';
import { vi, type MockedFunction } from 'vitest';
import { IPublicPostDTO } from '../model/ipublic-post-dto';
import { PageResponseDTO } from '../model/page-response-dto';
import { GetPostApiService } from './get-post-api-service';
import { GetPostService } from './get-post-service';

describe('GetPostService', () => {
  let service: GetPostService;
  let api: Pick<GetPostApiService, 'getPosts'>;
  let getPostsMock: MockedFunction<GetPostApiService['getPosts']>;

  const posts: IPublicPostDTO[] = [
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
  ];

  const pageResponse: PageResponseDTO<IPublicPostDTO> = {
    items: posts,
    limit: 10,
    offset: 0,
    total: 1,
  };

  beforeEach(() => {
    getPostsMock = vi.fn();
    api = {
      getPosts: getPostsMock,
    };

    TestBed.configureTestingModule({
      providers: [{ provide: GetPostApiService, useValue: api }],
    });

    service = TestBed.inject(GetPostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts in idle state', () => {
    expect(service.status()).toBe('idle');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toEqual([]);
    expect(service.errorMessage()).toBe('');
  });

  it('calls api.getPosts with default pagination params', () => {
    const request$ = new Subject<PageResponseDTO<IPublicPostDTO>>();
    getPostsMock.mockReturnValue(request$.asObservable());

    service.getPosts();

    expect(api.getPosts).toHaveBeenCalledTimes(1);
    expect(api.getPosts).toHaveBeenCalledWith(10, 0);
  });

  it('calls api.getPosts with provided pagination params', () => {
    const request$ = new Subject<PageResponseDTO<IPublicPostDTO>>();
    getPostsMock.mockReturnValue(request$.asObservable());

    service.getPosts(20, 10);

    expect(api.getPosts).toHaveBeenCalledTimes(1);
    expect(api.getPosts).toHaveBeenCalledWith(20, 10);
  });

  it('sets loading immediately when getPosts is called', () => {
    const request$ = new Subject<PageResponseDTO<IPublicPostDTO>>();
    getPostsMock.mockReturnValue(request$.asObservable());

    service.getPosts();

    expect(service.status()).toBe('loading');
    expect(service.isLoading()).toBeTruthy();
    expect(service.errorMessage()).toBeNull();
  });

  it('sets success and stores response items on api next', () => {
    const request$ = new Subject<PageResponseDTO<IPublicPostDTO>>();
    getPostsMock.mockReturnValue(request$.asObservable());

    service.getPosts();
    request$.next(pageResponse);

    expect(service.status()).toBe('success');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toEqual(posts);
    expect(service.errorMessage()).toBeNull();
  });

  it('keeps only items from paginated response and ignores pagination metadata in data', () => {
    const responseWithMoreTotal: PageResponseDTO<IPublicPostDTO> = {
      items: posts,
      limit: 1,
      offset: 10,
      total: 50,
    };
    getPostsMock.mockReturnValue(defer(() => of(responseWithMoreTotal)));

    service.getPosts(1, 10);

    expect(service.status()).toBe('success');
    expect(service.data()).toEqual(posts);
    expect(service.data()).not.toEqual(responseWithMoreTotal);
  });

  it('sets success with empty data when api returns an empty page', () => {
    const emptyResponse: PageResponseDTO<IPublicPostDTO> = {
      items: [],
      limit: 10,
      offset: 20,
      total: 15,
    };
    getPostsMock.mockReturnValue(defer(() => of(emptyResponse)));

    service.getPosts(10, 20);

    expect(service.status()).toBe('success');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toEqual([]);
    expect(service.errorMessage()).toBeNull();
  });

  it('sets error with network message when status is 0', () => {
    getPostsMock.mockReturnValue(
      defer((): Observable<PageResponseDTO<IPublicPostDTO>> => {
        throw new HttpErrorResponse({ status: 0 });
      }),
    );

    service.getPosts();

    expect(service.status()).toBe('error');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toEqual([]);
    expect(service.errorMessage()).toBe('Falha de conexão');
  });

  it('clears previous posts when a later request fails', () => {
    getPostsMock.mockReturnValue(defer(() => of(pageResponse)));
    service.getPosts();
    expect(service.data()).toEqual(posts);

    getPostsMock.mockReturnValue(
      defer((): Observable<PageResponseDTO<IPublicPostDTO>> => {
        throw new HttpErrorResponse({ status: 500 });
      }),
    );
    service.getPosts();

    expect(service.status()).toBe('error');
    expect(service.data()).toEqual([]);
    expect(service.errorMessage()).toBe('Erro ao autenticar (HTTP 500).');
  });

  it('sets error with forbidden message when status is 403', () => {
    getPostsMock.mockReturnValue(
      defer((): Observable<PageResponseDTO<IPublicPostDTO>> => {
        throw new HttpErrorResponse({ status: 403 });
      }),
    );

    service.getPosts();

    expect(service.status()).toBe('error');
    expect(service.data()).toEqual([]);
    expect(service.errorMessage()).toBe('Usuário ou senha inválidos.');
  });

  it('returns generic HTTP message for unexpected status codes', () => {
    getPostsMock.mockReturnValue(
      defer((): Observable<PageResponseDTO<IPublicPostDTO>> => {
        throw new HttpErrorResponse({ status: 500 });
      }),
    );

    service.getPosts();

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Erro ao autenticar (HTTP 500).');
  });

  it('falls back to generic message for non-HttpErrorResponse errors', () => {
    getPostsMock.mockReturnValue(
      defer((): Observable<PageResponseDTO<IPublicPostDTO>> => {
        throw new Error('boom');
      }),
    );

    service.getPosts();

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Erro inesperado ao autenticar.');
  });

  it('clears previous error message when starting a new request', () => {
    getPostsMock.mockReturnValue(
      defer((): Observable<PageResponseDTO<IPublicPostDTO>> => {
        throw new HttpErrorResponse({ status: 500 });
      }),
    );

    service.getPosts();
    expect(service.status()).toBe('error');
    expect(service.errorMessage()).not.toBeNull();

    const request$ = new Subject<PageResponseDTO<IPublicPostDTO>>();
    getPostsMock.mockReturnValue(request$.asObservable());
    service.getPosts();

    expect(service.status()).toBe('loading');
    expect(service.errorMessage()).toBeNull();
  });

  it('does not reset success to idle when api completes after emitting data', () => {
    const request$ = new Subject<PageResponseDTO<IPublicPostDTO>>();
    getPostsMock.mockReturnValue(request$.asObservable());

    service.getPosts();
    request$.next(pageResponse);
    request$.complete();

    expect(service.status()).toBe('success');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toEqual(posts);
  });

  it('keeps loading while request is still pending', () => {
    const request$ = new Subject<PageResponseDTO<IPublicPostDTO>>();
    getPostsMock.mockReturnValue(request$.asObservable());

    service.getPosts();

    expect(service.status()).toBe('loading');
    expect(service.isLoading()).toBeTruthy();
    expect(service.data()).toEqual([]);
  });

  it('uses the latest completed request state when multiple requests are started', () => {
    const firstRequest$ = new Subject<PageResponseDTO<IPublicPostDTO>>();
    const secondRequest$ = new Subject<PageResponseDTO<IPublicPostDTO>>();
    const secondPosts: IPublicPostDTO[] = [
      {
        ...posts[0],
        id: 'post-2',
        title: 'Post 2',
      },
    ];

    getPostsMock
      .mockReturnValueOnce(firstRequest$.asObservable())
      .mockReturnValueOnce(secondRequest$.asObservable());

    service.getPosts(10, 0);
    service.getPosts(10, 10);

    secondRequest$.next({ items: secondPosts, limit: 10, offset: 10, total: 20 });

    expect(api.getPosts).toHaveBeenNthCalledWith(1, 10, 0);
    expect(api.getPosts).toHaveBeenNthCalledWith(2, 10, 10);
    expect(service.status()).toBe('success');
    expect(service.data()).toEqual(secondPosts);
  });

  it('returns to idle if api completes without emitting', () => {
    getPostsMock.mockReturnValue(EMPTY);

    service.getPosts();

    expect(service.status()).toBe('idle');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toEqual([]);
    expect(service.errorMessage()).toBeNull();
  });
});
