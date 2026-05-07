import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EMPTY, Observable, Subject, defer } from 'rxjs';
import { vi, type MockedFunction } from 'vitest';
import { IUserBlogPublicDTO } from '../model/iuser-blog-public-dto';
import { IRegisterUserDTO } from '../model/iregister-user-dto';
import { RegisterUserApiService } from './register-user-api.service';
import { RegisterUserService } from './register-user-service';

describe('RegisterUserService', () => {
  let service: RegisterUserService;
  let api: Pick<RegisterUserApiService, 'register'>;
  let registerMock: MockedFunction<RegisterUserApiService['register']>;

  beforeEach(() => {
    registerMock = vi.fn();
    api = {
      register: registerMock,
    };

    TestBed.configureTestingModule({
      providers: [{ provide: RegisterUserApiService, useValue: api }],
    });
    service = TestBed.inject(RegisterUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  const payload: IRegisterUserDTO = {
    email: 'user@example.com',
    username: 'usuario123',
    password: 'password1234',
    confirmedPassword: 'password1234',
    firstName: 'User',
    lastName: 'Example',
  };

  const response: IUserBlogPublicDTO = {
    id: '00000000-0000-0000-0000-000000000000',
    username: 'usuario123',
    email: 'user@example.com',
  };

  it('starts in idle state', () => {
    expect(service.status()).toBe('idle');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toBeNull();
    expect(service.errorMessage()).toBeNull();
    expect(service.fieldErrors()).toBeNull();
  });

  it('calls api.register with the provided payload', () => {
    const request$ = new Subject<IUserBlogPublicDTO>();
    registerMock.mockReturnValue(request$.asObservable());

    service.register(payload);

    expect(api.register).toHaveBeenCalledTimes(1);
    expect(api.register).toHaveBeenCalledWith(payload);
  });

  it('sets loading immediately when register is called', () => {
    const request$ = new Subject<IUserBlogPublicDTO>();
    registerMock.mockReturnValue(request$.asObservable());

    service.register(payload);

    expect(service.status()).toBe('loading');
    expect(service.isLoading()).toBeTruthy();
    expect(service.errorMessage()).toBeNull();
    expect(service.fieldErrors()).toBeNull();
  });

  it('sets success and stores data on api next', () => {
    const request$ = new Subject<IUserBlogPublicDTO>();
    registerMock.mockReturnValue(request$.asObservable());

    service.register(payload);
    request$.next(response);

    expect(service.status()).toBe('success');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toEqual(response);
    expect(service.errorMessage()).toBeNull();
    expect(service.fieldErrors()).toBeNull();
  });

  it('sets error with friendly message on 409 conflict', () => {
    registerMock.mockReturnValue(
      defer((): Observable<IUserBlogPublicDTO> => {
        throw new HttpErrorResponse({ status: 409 });
      }),
    );

    service.register(payload);

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Usuário já existe.');
  });

  it('uses backend api error message when provided', () => {
    registerMock.mockReturnValue(
      defer((): Observable<IUserBlogPublicDTO> => {
        throw new HttpErrorResponse({
          status: 409,
          error: { message: 'Email já cadastrado.' },
        });
      }),
    );

    service.register(payload);

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Email já cadastrado.');
  });

  it('stores fieldErrors when provided by backend', () => {
    registerMock.mockReturnValue(
      defer((): Observable<IUserBlogPublicDTO> => {
        throw new HttpErrorResponse({
          status: 400,
          error: { message: 'Validation error', fieldErrors: { email: 'inválido' } },
        });
      }),
    );

    service.register(payload);

    expect(service.status()).toBe('error');
    expect(service.fieldErrors()).toEqual({ email: 'inválido' });
  });

  it('sets network error message when status is 0', () => {
    registerMock.mockReturnValue(
      defer((): Observable<IUserBlogPublicDTO> => {
        throw new HttpErrorResponse({ status: 0 });
      }),
    );

    service.register(payload);

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Falha de conexão');
  });

  it('returns generic HTTP message for unexpected status codes', () => {
    registerMock.mockReturnValue(
      defer((): Observable<IUserBlogPublicDTO> => {
        throw new HttpErrorResponse({ status: 500 });
      }),
    );

    service.register(payload);

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Erro ao registrar (HTTP 500).');
  });

  it('falls back to generic message for non-HttpErrorResponse errors', () => {
    registerMock.mockReturnValue(
      defer((): Observable<IUserBlogPublicDTO> => {
        throw new Error('boom');
      }),
    );

    service.register(payload);

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Erro inesperado ao registrar.');
  });

  it('clears previous errors when starting a new register attempt', () => {
    registerMock.mockReturnValue(
      defer((): Observable<IUserBlogPublicDTO> => {
        throw new HttpErrorResponse({ status: 409 });
      }),
    );

    service.register(payload);
    expect(service.status()).toBe('error');
    expect(service.errorMessage()).not.toBeNull();

    const request$ = new Subject<IUserBlogPublicDTO>();
    registerMock.mockReturnValue(request$.asObservable());
    service.register(payload);

    expect(service.status()).toBe('loading');
    expect(service.errorMessage()).toBeNull();
    expect(service.fieldErrors()).toBeNull();
  });

  it('resets back to idle', () => {
    registerMock.mockReturnValue(
      defer((): Observable<IUserBlogPublicDTO> => {
        throw new HttpErrorResponse({ status: 409 });
      }),
    );

    service.register(payload);
    expect(service.status()).toBe('error');

    service.reset();

    expect(service.status()).toBe('idle');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toBeNull();
    expect(service.errorMessage()).toBeNull();
    expect(service.fieldErrors()).toBeNull();
  });

  it('returns to idle if api completes without emitting', () => {
    registerMock.mockReturnValue(EMPTY);

    service.register(payload);

    expect(service.status()).toBe('idle');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toBeNull();
    expect(service.errorMessage()).toBeNull();
    expect(service.fieldErrors()).toBeNull();
  });
});
