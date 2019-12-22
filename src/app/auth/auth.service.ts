import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Router } from "@angular/router";
import {AuthDataLogin} from './auth-data.loginmodel';
import { Subject } from 'rxjs';
import {PostsService} from '../Posts/Posts.service';

@Injectable({providedIn: 'root'})

export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private userId: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();


    constructor(private http: HttpClient, private router: Router, private postService: PostsService) {}

    getToken() {
      return this.token;
    }
    getIsAuth() {
      return this.isAuthenticated;
    }
    getUserId() {
      return this.userId;
    }

    createUser(email: string, username: string, password: string) {
        const authData: AuthData = {email, username, password};
        return this.http.post('http://157.245.162.20:3000/api/user/signup', authData);
    }

    login(email: string, password: string) {
      const authDataLogin: AuthDataLogin = {email, password};
      this.http.post<{ token: string; expiresIn: number, userId: string }>('http://157.245.162.20:3000/api/user/login', authDataLogin)
        .subscribe(response => {
          const token = response.token;
          this.token = token;
          if (token) {
            if (token) {
              const expiresInDuration = response.expiresIn;
              this.isAuthenticated = true;
              this.userId = response.userId;
              this.authStatusListener.next(true);
              const now = new Date();
              const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
              console.log(expirationDate);
              this.router.navigate(['/']);
            }
          }
        });
    }
  getUsername(userID) {
    return this.http
      .get<string>(
        'http://157.245.162.20:3000/api/user/getUser', {params: {userid: userID}});
  }
    logout() {
      this.token = null;
      this.isAuthenticated = false;
      this.authStatusListener.next(false);
      this.router.navigate(['/']);

    }
}
