import { Component, OnInit } from '@angular/core';
import { PortafolioService } from '../Servicios/portafolio.service';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {

  eduacionList:any;

  constructor(private datos:PortafolioService) { }

  ngOnInit(): void {
  this.datos.ObtenerDatos().subscribe(data => {
  this.eduacionList = data.eduacion;
  })
 }
}
