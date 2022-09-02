import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PortafolioService {

  constructor(private http:HttpClient) { }

  ObtenerDatos():Observable<any> {

    return this.http.get("assets/datos/datos.json");

  }

}
