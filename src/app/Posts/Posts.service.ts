import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, Subject} from 'rxjs';

// import {Post} from './Post.model';

@Injectable({providedIn: 'root'})
export class PostsService {

  private posts: string[];

  constructor(private http: HttpClient) {}

   getSwipes(userID) {
     return this.http
      .get<string[] >(
        'http://157.245.162.20:3000/getSwipes', {params: {userid: userID}});
  }

  insertSwipe(userId, post, upvote) {
    this.http.post(
      'http://157.245.162.20:3000/insertSwipe', {userId, post, upvote}).subscribe(
        responseData => {
          console.log(responseData);
        });
  }
}
