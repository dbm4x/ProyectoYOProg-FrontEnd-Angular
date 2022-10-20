import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { PortafolioService } from './portafolio.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(private autentificador: PortafolioService) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<Object>> {
    var currentUser = this.autentificador.UsuarioAutenticado;
    if (currentUser && currentUser.accessToken) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${currentUser.accessToken}`,
        },
      });
    }
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        if (currentUser && currentUser.accessToken && err.status === 401) {
          this.autentificador.clear();
          window.location.href = '';
        }
        return throwError(err);
      })
    );
  }

  public islogged() {
    if (
      this.autentificador.UsuarioAutenticado &&
      this.autentificador.UsuarioAutenticado
    ) {
      return true;
    } else {
      return false;
    }
  }
}
