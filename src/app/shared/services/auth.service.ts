import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { User } from '../models/user';
import { environment } from './../../../environments/environment';

export interface AuthResponseData {
  id: number;
  token: string;
  expiresIn?: string;  // TODO: add expiration date (in API response)
  username?: string;
  first_name?: string;
  last_name?: string;
  group?: string;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = environment.devUrl;
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  // TODO remove this
  authenticated = true;

  constructor(private http: HttpClient, private router: Router) {}

  signup(username: string, password: string) {
    return this.http
      .post<AuthResponseData>(this.API_URL + 'auth',
        {
          username: username,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.id,
            resData.token,
            resData.username,
            +resData.expiresIn
          );
        })
      );
  }

  // login() ...

  // autoLogin() ...

  // logout() ...

  // autoLogout() ...

  private handleAuthentication(
    id: number,
    token: string,
    username: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(id, token, expirationDate, username);
    this.user.next(user);
    // this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return throwError(errorMessage);
  }

  // REMOVE this
  checkAuth() {
    // this.authenticated = this.store.getItem("demo_login_status");
  }

  getuser() {
    console.log('REMOVE THIS');
    this.authenticated = true;
  }

  signin(credentials) {
    console.log('REMOVE THIS', credentials);
  }
  signout() {
    console.log('REMOVE THIS');
    this.authenticated = false;
  }
}
