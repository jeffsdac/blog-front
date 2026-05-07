import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, tap } from 'rxjs';
import { IUserBlogPublicDTO } from '../model/iuser-blog-public-dto';
import { IRegisterUserDTO } from '../model/iregister-user-dto';
import { RegisterUserApiService } from './register-user-api.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterUserService {
  private readonly api = inject(RegisterUserApiService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly state = signal<RegisterUserState>({
    status: 'idle',
    data: null,
    errorMessage: null,
    fieldErrors: null,
  });

  readonly status = computed(() => this.state().status);
  readonly isLoading = computed(() => this.status() === 'loading');
  readonly data = computed(() => this.state().data);
  readonly errorMessage = computed(() => this.state().errorMessage);
  readonly fieldErrors = computed(() => this.state().fieldErrors);

  reset(): void {
    this.state.set({ status: 'idle', data: null, errorMessage: null, fieldErrors: null });
  }

  register(payload: IRegisterUserDTO): void {
    this.state.update((s) => ({ ...s, status: 'loading', errorMessage: null, fieldErrors: null }));

    this.api
      .register(payload)
      .pipe(
        tap((data) => {
          this.state.set({ status: 'success', data, errorMessage: null, fieldErrors: null });
        }),
        catchError((err: unknown) => {
          const formatted = this.formatError(err);
          this.state.set({
            status: 'error',
            data: null,
            errorMessage: formatted.message,
            fieldErrors: formatted.fieldErrors,
          });
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

  private formatError(err: unknown): { message: string; fieldErrors: Record<string, string> | null } {
    if (!(err instanceof HttpErrorResponse)) {
      return { message: 'Erro inesperado ao registrar.', fieldErrors: null };
    }

    if (err.status === 0) return { message: 'Falha de conexão', fieldErrors: null };

    const apiMessage =
      typeof err.error?.message === 'string' && err.error.message.trim().length > 0 ? err.error.message : null;
    const fieldErrors =
      err.error?.fieldErrors && typeof err.error.fieldErrors === 'object' ? (err.error.fieldErrors as Record<string, string>) : null;

    if (err.status === 409) return { message: apiMessage ?? 'Usuário já existe.', fieldErrors };
    if (err.status === 400) return { message: apiMessage ?? 'Dados inválidos.', fieldErrors };

    return { message: apiMessage ?? `Erro ao registrar (HTTP ${err.status}).`, fieldErrors };
  }
}

export type RegisterUserStatus = 'idle' | 'loading' | 'success' | 'error';

export interface RegisterUserState {
  status: RegisterUserStatus;
  data: IUserBlogPublicDTO | null;
  errorMessage: string | null;
  fieldErrors: Record<string, string> | null;
}
