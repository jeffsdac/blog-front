import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRegisterUserDTO } from '../model/iregister-user-dto';
import { IUserBlogPublicDTO } from '../model/iuser-blog-public-dto';

@Injectable({ providedIn: 'root' })
export class RegisterUserApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:8080/';

  register(payload: IRegisterUserDTO): Observable<IUserBlogPublicDTO> {
    const url = new URL('api/v1/user/register', this.apiBaseUrl).toString();
    return this.http.post<IUserBlogPublicDTO>(url, payload);
  }
}

