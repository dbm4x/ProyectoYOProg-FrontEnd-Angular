import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";


const helper = new JwtHelperService();


@Injectable({
  providedIn: 'root'
})
export class SessionServiceService {

  constructor() { }

  
  getToken(): string {
    return JSON.parse(sessionStorage.getItem('currentUser') || '{}');
  }

  getTokenExpirationDate(token: string): Date {
    token = this.getToken()
    const decoded = helper.decodeToken(token);

    if (decoded.exp === undefined) {
     // return null;
    }
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) token = this.getToken();
    if (!token) return true;

    const date = this.getTokenExpirationDate(token);
    if (date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  logOut(loginType?: string) {
    sessionStorage.removeItem('currentUser');
  }
}
