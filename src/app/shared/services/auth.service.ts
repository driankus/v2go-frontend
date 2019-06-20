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

  signup(username: string, password1: string, password2: string) {
    return this.http
      .post<AuthResponseData>(this.API_URL + 'sign-up',
        {
          username: username,
          password1: password1,
          password2: password2,
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

  login(username: string, password: string) {
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

  autoLogin() {
    const userData: {
      username: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }

    const loadedUser = new User(
      +userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData.username
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

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
      // TODO: Include this type of messages in API response
      case 'USERNAME_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'USERNAME_NOT_FOUND':
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
    this.authenticated = true;
  }

  signin(credentials) {
  }
  signout() {
    this.authenticated = false;
  }
}
