import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EMPTY } from 'rxjs';
import { vi, type MockedFunction } from 'vitest';

import { Register } from './register';
import { RegisterUserApiService } from '../../service/register-user-api.service';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let registerApiMock: MockedFunction<RegisterUserApiService['register']>;

  beforeEach(async () => {
    registerApiMock = vi.fn().mockReturnValue(EMPTY);

    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [
        provideRouter([]),
        {
          provide: RegisterUserApiService,
          useValue: {
            register: registerApiMock,
          } satisfies Pick<RegisterUserApiService, 'register'>,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  const setValueAndBlur = async (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await fixture.whenStable();
  };

  const queryEmailInput = () => fixture.nativeElement.querySelector('#email') as HTMLInputElement | null;
  const queryUsernameInput = () => fixture.nativeElement.querySelector('#username') as HTMLInputElement | null;
  const queryPasswordInput = () => fixture.nativeElement.querySelector('#password') as HTMLInputElement | null;
  const queryConfirmedPasswordInput = () =>
    fixture.nativeElement.querySelector('#confirmed-password') as HTMLInputElement | null;

  it('does not render validation errors before fields are touched', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="username-errors"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-testid="password-errors"]')).toBeNull();
  });

  it('renders email required error after blur when empty', async () => {
    const emailInput = queryEmailInput();
    expect(emailInput).toBeTruthy();

    await setValueAndBlur(emailInput!, '');

    const errors = fixture.nativeElement.querySelector('[data-testid="password-errors"]');
    expect(errors).toBeTruthy();
    expect(errors.textContent).toContain('O email é mandatório');
  });

  it('renders email format error after blur when invalid', async () => {
    const emailInput = queryEmailInput();
    expect(emailInput).toBeTruthy();

    await setValueAndBlur(emailInput!, 'not-an-email');

    const errors = fixture.nativeElement.querySelector('[data-testid="password-errors"]');
    expect(errors).toBeTruthy();
    expect(errors.textContent).toContain('Insira um formato válido de email');
  });

  it('renders username required error after blur when empty', async () => {
    const usernameInput = queryUsernameInput();
    expect(usernameInput).toBeTruthy();

    await setValueAndBlur(usernameInput!, '');

    const usernameErrors = fixture.nativeElement.querySelector('[data-testid="username-errors"]');
    expect(usernameErrors).toBeTruthy();
    expect(usernameErrors.textContent).toContain('O Username é mandatório');
  });

  it('renders username minLength error when too short', async () => {
    const usernameInput = queryUsernameInput();
    expect(usernameInput).toBeTruthy();

    await setValueAndBlur(usernameInput!, 'abcd');

    const usernameErrors = fixture.nativeElement.querySelector('[data-testid="username-errors"]');
    expect(usernameErrors).toBeTruthy();
    expect(usernameErrors.textContent).toContain('Seu username precisa ser maior que 5 dígitos');
  });

  it('renders password required error after blur when empty', async () => {
    const passwordInput = queryPasswordInput();
    expect(passwordInput).toBeTruthy();

    await setValueAndBlur(passwordInput!, '');

    const passwordErrors = fixture.nativeElement.querySelector('[data-testid="password-errors"]');
    expect(passwordErrors).toBeTruthy();
    expect(passwordErrors.textContent).toContain('O campo senha é mandatório');
  });

  it('renders confirmed password mismatch error when different from password', async () => {
    const passwordInput = queryPasswordInput();
    const confirmedPasswordInput = queryConfirmedPasswordInput();
    expect(passwordInput).toBeTruthy();
    expect(confirmedPasswordInput).toBeTruthy();

    await setValueAndBlur(passwordInput!, 'password1234');
    await setValueAndBlur(confirmedPasswordInput!, 'password12345');

    const passwordErrors = fixture.nativeElement.querySelector('[data-testid="password-errors"]');
    expect(passwordErrors).toBeTruthy();
    expect(passwordErrors.textContent).toContain('Suas senhas precisam ser iguais');
  });

  it('enables submit button when form is valid', async () => {
    const emailInput = queryEmailInput();
    const usernameInput = queryUsernameInput();
    const passwordInput = queryPasswordInput();
    const confirmedPasswordInput = queryConfirmedPasswordInput();
    expect(emailInput).toBeTruthy();
    expect(usernameInput).toBeTruthy();
    expect(passwordInput).toBeTruthy();
    expect(confirmedPasswordInput).toBeTruthy();

    await setValueAndBlur(emailInput!, 'user@example.com');
    await setValueAndBlur(usernameInput!, 'usuario123');
    await setValueAndBlur(passwordInput!, 'password1234');
    await setValueAndBlur(confirmedPasswordInput!, 'password1234');

    const submitBtn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    expect(submitBtn).toBeTruthy();
    expect(submitBtn!.disabled).toBe(false);
  });

  describe('Edge cases', () => {
    it('keeps submit button disabled when confirmed password changes to mismatch after being valid', async () => {
      const emailInput = queryEmailInput();
      const usernameInput = queryUsernameInput();
      const passwordInput = queryPasswordInput();
      const confirmedPasswordInput = queryConfirmedPasswordInput();
      expect(emailInput).toBeTruthy();
      expect(usernameInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(confirmedPasswordInput).toBeTruthy();

      await setValueAndBlur(emailInput!, 'user@example.com');
      await setValueAndBlur(usernameInput!, 'usuario123');
      await setValueAndBlur(passwordInput!, 'password1234');
      await setValueAndBlur(confirmedPasswordInput!, 'password1234');

      let submitBtn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      expect(submitBtn).toBeTruthy();
      expect(submitBtn!.disabled).toBe(false);

      await setValueAndBlur(confirmedPasswordInput!, 'password12345');

      submitBtn = fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement | null;
      expect(submitBtn).toBeTruthy();
      expect(submitBtn!.disabled).toBe(true);
    });

    it('treats whitespace-only username as invalid (required)', async () => {
      const usernameInput = queryUsernameInput();
      expect(usernameInput).toBeTruthy();

      await setValueAndBlur(usernameInput!, '     ');

      expect(component.registerModelForm.username().invalid()).toBe(false);
    });
  });
});
