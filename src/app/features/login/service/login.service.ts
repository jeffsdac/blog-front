import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, tap } from 'rxjs';
import { ILoginDTO } from '../models/ilogin-dto';
import { LoginApiService } from './login-api.service';

export type LoginStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LoginState {
  status: LoginStatus;
  data: ILoginDTO | null;
  errorMessage: string | null;
}

@Injectable({ providedIn: 'root' })
export class LoginService {
  private readonly api = inject(LoginApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly state = signal<LoginState>({
    status: 'idle',
    data: null,
    errorMessage: null,
  });

  readonly status = computed(() => this.state().status);
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly data = computed(() => this.state().data);
  readonly errorMessage = computed(() => this.state().errorMessage);

  reset(): void {
    this.state.set({ status: 'idle', data: null, errorMessage: null });
  }

  doLogin(login: ILoginDTO): void {
    this.state.update((s) => ({ ...s, status: 'loading', errorMessage: null }));

    this.api
      .doLogin(login)
      .pipe(
        tap((data) => {
          this.state.set({ status: 'success', data, errorMessage: null });
        }),
        catchError((err: unknown) => {
          this.state.set({ status: 'error', data: null, errorMessage: this.formatError(err) });
          return of(null);
        }),
        finalize(() => {
          if (this.state().status === 'loading') {
            this.state.update((s) => ({ ...s, status: 'idle' }));
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private formatError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) return 'Falha de conexão';
      if (err.status === 403) return 'Usuário ou senha inválidos.';
      return `Erro ao autenticar (HTTP ${err.status}).`;
    }
    return 'Erro inesperado ao autenticar.';
  }
}

