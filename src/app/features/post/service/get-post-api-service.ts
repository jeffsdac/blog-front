import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPublicPostDTO } from '../model/ipublic-post-dto';
import { PageResponseDTO } from '../model/page-response-dto';

@Injectable({providedIn: 'root'})
export class GetPostApiService {
  private http = inject(HttpClient);
  private readonly apiBaseUrl = "http://localhost:8080/";

  getPosts( limit : number = 10, offset: number = 0  ) : Observable<PageResponseDTO<IPublicPostDTO>>{
    console.log("Method: GetPosts; Class: GetPostService");

    const endpoint = "api/v1/posts"
    const url = `${this.apiBaseUrl}${endpoint}?limit=${limit}&offset=${offset}`;
    console.log("GET in: " + url);

    return this.http.get<PageResponseDTO<IPublicPostDTO>>(url);

  } 

}
