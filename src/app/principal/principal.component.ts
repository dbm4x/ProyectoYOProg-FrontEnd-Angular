import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PortafolioService } from '../Servicios/portafolio.service';

declare var ParticleNetwork: any;

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css'],
})
export class PrincipalComponent implements OnInit {
  @ViewChild('edit') meditar: any;
  @ViewChild('fotoPerfil') mperfilfoto: any;
  @ViewChild('persona') mpersona: any;
  @ViewChild('portada') mportada: any;

  currentUser: any;
  miPortafolio: any;
  form: FormGroup;
  imageSrc: any;
  Logged = false;

  constructor(
    private modalService: NgbModal,
    private datos: PortafolioService,
    private fb: FormBuilder,
    private toastrService: ToastrService
  ) {
    this.form = this.fb.group({
      id: [''],
      nombre: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(
            "^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1 ,.'-]+$"
          ),
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(
            "^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1 ,.'-]+$"
          ),
        ],
      ],
      localidad: [
        '',
        [
          Validators.required,
          Validators.maxLength(40),
          Validators.pattern(
            "^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1 ,.'-]+$"
          ),
        ],
      ],
      titulo: [
        '',
        [
          Validators.required,
          Validators.maxLength(45),
          Validators.pattern(
            "^[a-zA-ZÀ-ÿ\u00f1\u00d1]+(s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1  ,.'-]+$"
          ),
        ],
      ],
      Usuario_id: [''],
      foto_perfil_url: [''],
      foto_portada: [''],
      canvas: [''],
      interactivo: [''],
      particula: [''],
      velocidad: [''],
      densidad: [''],
      acercade: this.fb.group({
        id: [''],
        titulo: ['', [Validators.required, Validators.maxLength(45)]],
        subtitulo: ['', [Validators.maxLength(40)]],
        texto: ['', [Validators.maxLength(250)]],
        visible: [''],
        persona_id: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.Logged = false;
    this.datos.ObtenerDatos('persona').subscribe((data) => {
      this.miPortafolio = data;

      var canvasDiv = document.getElementById('particle-canvas');
      var options = {
        particleColor: data.particula,
        background: data.foto_portada,
        interactive: data.interactivo,
        speed: data.velocidad,
        density: data.densidad,
        activo: data.canvas,
      };
      var particleCanvas = new ParticleNetwork(canvasDiv, options);
    });

    this.currentUser = this.datos.UsuarioAutenticado;
    if (this.currentUser && this.currentUser.accessToken) {
      this.Logged = true;
    } else {
      this.Logged = false;
    }
  }

  get Titulo() {
    return this.form.get('titulo');
  }
  get Nombre() {
    return this.form.get('nombre');
  }

  get Foto_portada() {
    return this.form.get('foto_portada');
  }

  get Apellido() {
    return this.form.get('apellido');
  }

  get Localidad() {
    return this.form.get('localidad');
  }

  get Subtitulo() {
    return this.form.get('subtitulo');
  }
  get Texto() {
    return this.form.get('texto');
  }

  readURL(url: any): void {
    this.imageSrc = url;
  }

  editar() {
    const modalRef = this.modalService
      .open(this.meditar, { centered: true })
      .result.then((result) => {
        if (this.form.valid) {
          this.datos.Editar(this.form.value, 'persona').subscribe(
            (data) => {
              this.toastrService.success('Cambios guardados correctamente.');
              this.miPortafolio = data;
            },
            (err) => {
              this.toastrService.error('Error al guardar los cambios.');
            }
          );
        }
      });

    this.form.patchValue(this.miPortafolio);
  }

  Portada() {
    this.imageSrc = this.miPortafolio.foto_portada;

    const modalRef = this.modalService
      .open(this.mportada, { centered: true })
      .result.then((result) => {
        if (this.form.valid) {
          this.datos.Editar(this.form.value, 'persona').subscribe(
            (data) => {
              window.location.href = '';
            },
            (err) => {
              this.toastrService.error('Error al guardar los cambios.');
            }
          );
        }
      });

    this.form.patchValue(this.miPortafolio);
  }

  foto_perfil() {
    this.imageSrc = this.miPortafolio.foto_perfil_url;
    const modalRef = this.modalService
      .open(this.mperfilfoto, { centered: true })
      .result.then((result) => {
        if (this.form.valid) {
          this.datos.Editar(this.form.value, 'persona').subscribe(
            (data) => {
              this.toastrService.success('Cambios guardados correctamente.');
              this.miPortafolio = data;
            },
            (err) => {
              this.toastrService.error('Error al guardar los cambios.');
            }
          );
        }
      });
    this.form.patchValue(this.miPortafolio);
  }

  visible(index: number) {
    this.miPortafolio.acercade.visible = !this.miPortafolio.acercade.visible;
    this.datos.Editar(this.miPortafolio, 'persona').subscribe(
      (data) => {
        this.toastrService.success('Cambios guardados correctamente.');
        this.miPortafolio = data;
      },
      (err) => {
        this.toastrService.error('Error al guardar los cambios.');
      }
    );
  }

  editar_persona() {
    const modalRef = this.modalService
      .open(this.mpersona, { centered: true })
      .result.then((result) => {
        if (this.form.valid) {
          this.datos.Editar(this.form.value, 'persona').subscribe(
            (data) => {
              this.toastrService.success('Cambios guardados correctamente.');
              this.miPortafolio = data;
            },
            (err) => {
              this.toastrService.error('Error al guardar los cambios.');
            }
          );
        }
      });

    this.form.patchValue(this.miPortafolio);
  }
}
