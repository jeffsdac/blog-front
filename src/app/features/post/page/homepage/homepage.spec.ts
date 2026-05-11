import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { vi, type MockedFunction } from 'vitest';
import { IPublicPostDTO } from '../../model/ipublic-post-dto';
import { GetPostService } from '../../service/get-post-service';
import { Homepage } from './homepage';

describe('Homepage', () => {
  let component: Homepage;
  let fixture: ComponentFixture<Homepage>;
  let getPostsMock: MockedFunction<GetPostService['getPosts']>;

  const loading = signal(false);
  const posts = signal<IPublicPostDTO[]>([]);
  const errorMessage = signal<string | null>(null);

  const firstPost: IPublicPostDTO = {
    id: 'post-1',
    title: 'Primeiro post',
    content: 'Conteudo do primeiro post',
    authorId: 'author-1',
    authorUsername: 'jeffsdac',
    likeVotes: 10,
    unlikeVotes: 1,
    createdAt: new Date('2026-05-11T10:00:00.000Z'),
  };

  const secondPost: IPublicPostDTO = {
    id: 'post-2',
    title: 'Segundo post',
    content: 'Conteudo do segundo post',
    authorId: 'author-1',
    authorUsername: 'jeffsdac',
    likeVotes: 3,
    unlikeVotes: 0,
    createdAt: new Date('2026-05-11T11:00:00.000Z'),
  };

  beforeEach(async () => {
    loading.set(false);
    posts.set([]);
    errorMessage.set(null);
    getPostsMock = vi.fn();

    await TestBed.configureTestingModule({
      imports: [Homepage],
      providers: [
        {
          provide: GetPostService,
          useValue: {
            getPosts: getPostsMock,
            isLoading: loading.asReadonly(),
            data: posts.asReadonly(),
            errorMessage: errorMessage.asReadonly(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Homepage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function textContent(): string {
    return fixture.nativeElement.textContent;
  }

  function postCards(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('app-post-card');
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('calls getPosts on init', () => {
    expect(getPostsMock).toHaveBeenCalledTimes(1);
  });

  it('renders the page shell smoke elements', () => {
    expect(textContent()).toContain('Ordenar por');
    expect(textContent()).toContain('Recentes');
    expect(textContent()).toContain('Populares');
    expect(textContent()).toContain('Categoria');
    expect(textContent()).toContain('Homepage');
  });

  it('shows loading state while posts are loading', () => {
    loading.set(true);
    fixture.detectChanges();

    expect(textContent()).toContain('Carregando posts...');
    expect(fixture.nativeElement.querySelector('[role="status"]')).not.toBeNull();
  });

  it('does not show empty state while loading', () => {
    loading.set(true);
    posts.set([]);
    fixture.detectChanges();

    expect(textContent()).toContain('Carregando posts...');
    expect(textContent()).not.toContain('Nenhum post encontrado com esses filtros');
  });

  it('shows empty state when not loading and no posts are returned', () => {
    loading.set(false);
    posts.set([]);
    errorMessage.set(null);
    fixture.detectChanges();

    expect(textContent()).toContain('Nenhum post encontrado com esses filtros');
    expect(textContent()).toContain('Tente reduzir os seus filtros');
  });

  it('shows friendly error state when service exposes an error message', () => {
    loading.set(false);
    posts.set([]);
    errorMessage.set('Falha de conexão');
    fixture.detectChanges();

    expect(textContent()).toContain('Não foi possível carregar os posts');
    expect(textContent()).toContain('Falha de conexão');
    expect(textContent()).toContain('Tente atualizar a página');
  });

  it('does not show empty state when there is an error', () => {
    loading.set(false);
    posts.set([]);
    errorMessage.set('Erro ao carregar posts.');
    fixture.detectChanges();

    expect(textContent()).toContain('Erro ao carregar posts.');
    expect(textContent()).not.toContain('Nenhum post encontrado com esses filtros');
  });

  it('renders one post card for each post returned by the service', () => {
    posts.set([firstPost, secondPost]);
    fixture.detectChanges();

    expect(postCards().length).toBe(2);
    expect(textContent()).toContain('Primeiro post');
    expect(textContent()).toContain('Segundo post');
  });

  it('passes title, content, likes and unlikes to post card', () => {
    posts.set([firstPost]);
    fixture.detectChanges();

    expect(textContent()).toContain('Primeiro post');
    expect(textContent()).toContain('Conteudo do primeiro post');
    expect(textContent()).toContain('10');
    expect(textContent()).toContain('1');
  });

  it('renders zero unlike count correctly', () => {
    posts.set([secondPost]);
    fixture.detectChanges();

    expect(textContent()).toContain('Segundo post');
    expect(textContent()).toContain('3');
    expect(textContent()).toContain('0');
  });

  it('keeps rendering posts when data exists and there is no error', () => {
    loading.set(false);
    errorMessage.set(null);
    posts.set([firstPost]);
    fixture.detectChanges();

    expect(postCards().length).toBe(1);
    expect(textContent()).not.toContain('Carregando posts...');
    expect(textContent()).not.toContain('Nenhum post encontrado com esses filtros');
    expect(textContent()).not.toContain('Não foi possível carregar os posts');
  });
});
