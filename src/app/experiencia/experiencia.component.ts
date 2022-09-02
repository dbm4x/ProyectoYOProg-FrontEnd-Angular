import { Component, OnInit } from '@angular/core';
import { PortafolioService } from '../Servicios/portafolio.service';




@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent implements OnInit {

  experienciaList:any;

  constructor(private datos:PortafolioService) { }

  ngOnInit(): void {
  this.datos.ObtenerDatos().subscribe(data => {
  this.experienciaList = data.experiencia;
  })
 }
}
