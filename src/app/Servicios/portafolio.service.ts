import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

const httpOptions = {
 // headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PortafolioService {
  //api_login_url = 'https://afternoon-castle-41460.herokuapp.com/api/auth/signin';
  //api_url = 'https://afternoon-castle-41460.herokuapp.com/api/';
  api_login_url = 'https://foolish-wilhelmine-h04x.koyeb.app/api/auth/signin';
  api_url = 'https://foolish-wilhelmine-h04x.koyeb.app/api/';

  currentUserSubject: BehaviorSubject<any>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(sessionStorage.getItem('currentUser') || '{}')
    );
  }

  InciarSesion(credenciales: any): Observable<any> {
    return this.http.post(this.api_login_url, credenciales, httpOptions).pipe(
      map((data) => {
        sessionStorage.setItem('currentUser', JSON.stringify(data));
        this.currentUserSubject.next(data);
        return data;
      })
    );
  }

  Editar(experiencia: any, opcion: any): Observable<any> {
    return this.http.put(
      this.api_url + opcion + '/editar',
      experiencia,
      httpOptions
    );
  }

  Drag(experiencia: any, opcion: any): Observable<any> {
    return this.http.put(
      this.api_url + opcion + '/editar/drag',
      experiencia,
      httpOptions
    );
  }

  eliminar(id: number, experiencia: any, opcion: any): Observable<any> {
    return this.http.delete(
      this.api_url + opcion + '/eliminar/' + id,
      experiencia
    );
  }

  Agregar(id: number, experiencia: any, opcion: any): Observable<any> {
    return this.http.post(
      this.api_url + opcion + '/crear/' + id,
      experiencia,
      httpOptions
    );
  }

  ObtenerDatos(opcion: any): Observable<any> {
    return this.http.get<any>(this.api_url + 'ver/' + opcion);
  }

  get UsuarioAutenticado() {
    return this.currentUserSubject.value;
  }

  public clear() {
    sessionStorage.clear();
  }
}
