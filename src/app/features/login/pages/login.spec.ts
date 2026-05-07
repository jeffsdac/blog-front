import { HttpErrorResponse } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EMPTY, defer } from 'rxjs';
import { vi, type MockedFunction } from 'vitest';
import { ILoginDTO } from '../models/ilogin-dto';
import { LoginApiService } from '../service/login-api.service';
import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let doLoginApiMock: MockedFunction<LoginApiService['doLogin']>;

  beforeEach(async () => {
    doLoginApiMock = vi.fn().mockReturnValue(EMPTY);

    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        provideRouter([]),
        {
          provide: LoginApiService,
          useValue: {
            doLogin: doLoginApiMock,
          } satisfies Pick<LoginApiService, 'doLogin'>,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('does not render validation errors before fields are touched', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="username-errors"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="password-errors"]')).toBeNull();
  });

  it('renders username required error after blur when empty', async () => {
    const usernameInput = fixture.nativeElement.querySelector('#username') as HTMLInputElement | null;
    expect(usernameInput).toBeTruthy();

    usernameInput!.value = '';
    usernameInput!.dispatchEvent(new Event('input'));
    usernameInput!.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await fixture.whenStable();

    const usernameErrors = fixture.nativeElement.querySelector('[data-testid="username-errors"]');
    expect(usernameErrors).toBeTruthy();
    expect(usernameErrors.textContent).toContain('Campo obrigatório');
    expect(usernameErrors.textContent).not.toContain('Tamanho mínimo é de 5 caracteres');
  });

  it('renders password required error after blur when empty', async () => {
    const passwordInput = fixture.nativeElement.querySelector('#password') as HTMLInputElement | null;
    expect(passwordInput).toBeTruthy();

    passwordInput!.value = '';
    passwordInput!.dispatchEvent(new Event('input'));
    passwordInput!.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await fixture.whenStable();

    const passwordErrors = fixture.nativeElement.querySelector('[data-testid="password-errors"]');
    expect(passwordErrors).toBeTruthy();
    expect(passwordErrors.textContent).toContain('Campo obrigatório');
    expect(passwordErrors.textContent).not.toContain('Senha precisa ter pelo menos 10 caractéres');
  });

  it('renders username minLength error when too short', async () => {
    const usernameInput = fixture.nativeElement.querySelector('#username') as HTMLInputElement | null;
    expect(usernameInput).toBeTruthy();

    usernameInput!.value = 'abcd';
    usernameInput!.dispatchEvent(new Event('input'));
    usernameInput!.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await fixture.whenStable();

    const usernameErrors = fixture.nativeElement.querySelector('[data-testid="username-errors"]');
    expect(usernameErrors).toBeTruthy();
    expect(usernameErrors.textContent).toContain('Tamanho mínimo é de 5 caracteres');
  });

  it('renders password minLength error when too short', async () => {
    const passwordInput = fixture.nativeElement.querySelector('#password') as HTMLInputElement | null;
    expect(passwordInput).toBeTruthy();

    passwordInput!.value = 'short';
    passwordInput!.dispatchEvent(new Event('input'));
    passwordInput!.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await fixture.whenStable();

    const passwordErrors = fixture.nativeElement.querySelector('[data-testid="password-errors"]');
    expect(passwordErrors).toBeTruthy();
    expect(passwordErrors.textContent).toContain('Senha precisa ter pelo menos 10 caractéres');
  });

  it('renders api error message when login fails (403)', async () => {
    doLoginApiMock.mockReturnValueOnce(
      defer(() => {
        throw new HttpErrorResponse({ status: 403 });
      }),
    );

    component.loginModel.set({ username: 'user1', password: 'password1234' } satisfies ILoginDTO);
    component.onSubmit(new Event('submit'));

    fixture.detectChanges();
    await fixture.whenStable();

    const apiError = fixture.nativeElement.querySelector('[data-testid="login-api-error"]');
    expect(apiError).toBeTruthy();
    expect(apiError.textContent).toContain('Usuário ou senha inválidos.');
  });
});
