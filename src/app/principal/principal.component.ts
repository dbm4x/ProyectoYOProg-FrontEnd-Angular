import { Component, OnInit } from '@angular/core';
import { PortafolioService } from '../Servicios/portafolio.service';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  miPortafolio:any;

  constructor(private datos:PortafolioService) { }

  ngOnInit(): void {
    this.datos.ObtenerDatos().subscribe(data => {
    this.miPortafolio = data;
    console.log(data);
    });
  }
  }
