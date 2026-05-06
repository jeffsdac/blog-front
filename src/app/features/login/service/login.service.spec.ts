import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { EMPTY, Observable, Subject, defer } from 'rxjs';
import { vi, type MockedFunction } from 'vitest';
import { ILoginDTO } from '../models/ilogin-dto';
import { LoginApiService } from './login-api.service';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let api: Pick<LoginApiService, 'doLogin'>;
  let doLoginMock: MockedFunction<LoginApiService['doLogin']>;

  beforeEach(() => {
    doLoginMock = vi.fn();
    api = {
      doLogin: doLoginMock,
    };

    TestBed.configureTestingModule({
      providers: [{ provide: LoginApiService, useValue: api }],
    });

    service = TestBed.inject(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('starts in idle state', () => {
    expect(service.status()).toBe('idle');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toBeNull();
    expect(service.errorMessage()).toBeNull();
  });

  it('calls api.doLogin with the provided login payload', () => {
    const request$ = new Subject<ILoginDTO>();
    doLoginMock.mockReturnValue(request$.asObservable());

    const login: ILoginDTO = { username: 'user', password: 'password1234' };
    service.doLogin(login);

    expect(api.doLogin).toHaveBeenCalledTimes(1);
    expect(api.doLogin).toHaveBeenCalledWith(login);
  });

  it('sets loading immediately when doLogin is called', () => {
    const request$ = new Subject<ILoginDTO>();
    doLoginMock.mockReturnValue(request$.asObservable());

    service.doLogin({ username: 'user', password: 'password1234' });

    expect(service.status()).toBe('loading');
    expect(service.isLoading()).toBeTruthy();
    expect(service.errorMessage()).toBeNull();
  });

  it('sets success and stores data on api next', () => {
    const request$ = new Subject<ILoginDTO>();
    doLoginMock.mockReturnValue(request$.asObservable());

    const login: ILoginDTO = { username: 'user', password: 'password1234' };
    service.doLogin(login);

    request$.next(login);

    expect(service.status()).toBe('success');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toEqual(login);
    expect(service.errorMessage()).toBeNull();
  });

  it('sets error with friendly message on HttpErrorResponse', () => {
    const request$ = new Subject<ILoginDTO>();
    doLoginMock.mockReturnValue(request$.asObservable());

    service.doLogin({ username: 'user', password: 'password1234' });
    request$.error(new HttpErrorResponse({ status: 403 }));

    expect(service.status()).toBe('error');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toBeNull();
    expect(service.errorMessage()).toBe('Usuário ou senha inválidos.');
  });

  it('sets network error message when status is 0', () => {
    doLoginMock.mockReturnValue(
      defer((): Observable<ILoginDTO> => {
        throw new HttpErrorResponse({ status: 0 });
      }),
    );

    service.doLogin({ username: 'user', password: 'password1234' });

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Falha de rede ao conectar na API.');
  });

  it('returns generic HTTP message for unexpected status codes', () => {
    doLoginMock.mockReturnValue(
      defer((): Observable<ILoginDTO> => {
        throw new HttpErrorResponse({ status: 500 });
      }),
    );

    service.doLogin({ username: 'user', password: 'password1234' });

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Erro ao autenticar (HTTP 500).');
  });

  it('falls back to generic message for non-HttpErrorResponse errors', () => {
    doLoginMock.mockReturnValue(
      defer((): Observable<ILoginDTO> => {
        throw new Error('boom');
      }),
    );

    service.doLogin({ username: 'user', password: 'password1234' });

    expect(service.status()).toBe('error');
    expect(service.errorMessage()).toBe('Erro inesperado ao autenticar.');
  });

  it('clears previous error message when starting a new login attempt', () => {
    doLoginMock.mockReturnValue(
      defer((): Observable<ILoginDTO> => {
        throw new HttpErrorResponse({ status: 403 });
      }),
    );

    service.doLogin({ username: 'user', password: 'password1234' });
    expect(service.status()).toBe('error');
    expect(service.errorMessage()).not.toBeNull();

    const request$ = new Subject<ILoginDTO>();
    doLoginMock.mockReturnValue(request$.asObservable());
    service.doLogin({ username: 'user', password: 'password1234' });

    expect(service.status()).toBe('loading');
    expect(service.errorMessage()).toBeNull();
  });

  it('resets back to idle', () => {
    doLoginMock.mockReturnValue(
      defer((): Observable<ILoginDTO> => {
        throw new HttpErrorResponse({ status: 403 });
      }),
    );

    service.doLogin({ username: 'user', password: 'password1234' });
    expect(service.status()).toBe('error');

    service.reset();

    expect(service.status()).toBe('idle');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toBeNull();
    expect(service.errorMessage()).toBeNull();
  });

  it('returns to idle if api completes without emitting', () => {
    doLoginMock.mockReturnValue(EMPTY);

    service.doLogin({ username: 'user', password: 'password1234' });

    expect(service.status()).toBe('idle');
    expect(service.isLoading()).toBeFalsy();
    expect(service.data()).toBeNull();
    expect(service.errorMessage()).toBeNull();
  });
});
