import { Component, OnInit } from '@angular/core';

declare var ParticleNetwork: any;


@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    var canvasDiv = document.getElementById('particle-canvas');
    var options = {
      particleColor: '#ffff1f',
      background: 'assets/img/banner.jpg',
      interactive: true,
      speed: 'slow',
      density: 'high'
    };
    var particleCanvas = new ParticleNetwork(canvasDiv, options);
  }

}
