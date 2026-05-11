import { computed, DestroyRef, inject, Injectable, signal } from "@angular/core";
import { IPublicPostDTO } from "../model/ipublic-post-dto";
import { GetPostApiService } from "./get-post-api-service";
import { catchError, finalize, of, tap } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

export type PostStatus = 'idle' | 'loading' | 'success' | 'error';

export interface PostState {
  status: PostStatus;
  data: IPublicPostDTO[] | [];
  errorMessage: string | null;
}

@Injectable( { providedIn: 'root' } )
export class GetPostService {
    private readonly api = inject(GetPostApiService);
    private readonly destroyRef = inject(DestroyRef);

    private readonly state = signal<PostState>({
        data: [],
        status: 'idle',
        errorMessage: '',
    });

    readonly status = computed(() => this.state().status);
    readonly isLoading = computed(() => this.status() === 'loading');
    readonly data = computed(() => this.state().data);
    readonly errorMessage = computed(() => this.state().errorMessage);

    getPosts( limit: number = 10, offset: number = 0 ) : void {
        console.log("IN GET POSTS; CLASS GET-POST-SERVICE")
        this.state.update((s) => ({ ...s, status: 'loading', errorMessage: null }));
        
        this.api.getPosts()
        .pipe(
            tap( (response) => {
                this.state.set({status: "success", data: response.items, errorMessage: null})
            }),
            catchError( (err: unknown) => {
                this.state.set({ status: "error", data: [], errorMessage: this.formatError(err) })
                return of(null);
            }),
            finalize( () => {
                if (this.state().status === "loading"){
                    this.state.update( (s) => ({...s, status: 'idle'}) )
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
