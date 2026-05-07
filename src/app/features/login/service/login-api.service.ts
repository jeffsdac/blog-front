import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILoginDTO } from '../models/ilogin-dto';

@Injectable({ providedIn: 'root' })
export class LoginApiService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = "http://localhost:8080/";

  doLogin(login: ILoginDTO): Observable<ILoginDTO> {
    const url = new URL('api/v1/user/login', this.apiBaseUrl).toString();
    return this.http.post<ILoginDTO>(url, login);
  }
}

