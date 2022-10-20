import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PortafolioService } from '../Servicios/portafolio.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css'],
})
export class ExperienciaComponent implements OnInit {
  @ViewChild('mborrar') mborrar: any;
  @ViewChild('edit') meditar: any;
  @ViewChild('crear') mcrear: any;

  Logged = false;
  form: FormGroup;
  imageSrc: any;
  currentUser: any;
  experienciaList: any = [];
  experienciaList_copia: { id: number }[] = [];

  constructor(
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private datos: PortafolioService
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required]],
      subtitulo: [''],
      logo: [''],
      link: [''],
      texto: [''],
      fecha_inicio: [''],
      fecha_fin: [''],
      id: [''],
      Persona_id: [''],
    });
  }

  ngOnInit(): void {
    this.datos.ObtenerDatos('exp').subscribe((data) => {
      this.experienciaList = data;

      this.experienciaList_copia = [...this.experienciaList];
    });

    this.currentUser = this.datos.UsuarioAutenticado;
    if (this.currentUser && this.currentUser.accessToken) {
      this.Logged = true;
    } else {
      this.Logged = false;
    }
  }

  Crear() {
    this.form.reset();
    this.imageSrc = null;

    const modalRef = this.modalService
      .open(this.mcrear, { centered: true })
      .result.then((result) => {
        if (this.form.valid) {
          this.datos
            .Agregar(this.currentUser.id, this.form.value, 'exp')
            .subscribe(
              (data) => {
                this.toastrService.success('Cambios guardados correctamente.');
                this.experienciaList.push(data);
                this.experienciaList_copia = [...this.experienciaList];
              },
              (err) => {
                this.toastrService.error('Error al guardar los cambios.');
              }
            );
        }
      });
  }

  get Titulo() {
    return this.form.get('titulo');
  }

  editar(index: any) {
    this.imageSrc = this.experienciaList[index].logo;
    const modalRef = this.modalService
      .open(this.meditar, { centered: true })
      .result.then((result) => {
        if (this.form.valid) {
          this.datos.Editar(this.form.value, 'exp').subscribe(
            (data) => {
              this.toastrService.success('Cambios guardados correctamente.');

              this.experienciaList[index] = data;
            },
            (err) => {
              this.toastrService.error('Error al guardar los cambios.');
            }
          );
        }
      });

    this.form.setValue(this.experienciaList[index]);
  }

  readURL(url: any): void {
    this.imageSrc = url;
  }

  borrar(id: number, item: any) {
    const modalRef = this.modalService
      .open(this.mborrar, { centered: true })
      .result.then((result) => {
        this.datos.eliminar(id, this.form.value, 'exp').subscribe(
          (data) => {
            this.toastrService.success('Eliminado correctamente.');

            var index = this.experienciaList.indexOf(item);
            this.experienciaList.splice(index, 1);
          },
          (err) => {
            this.toastrService.error('Error al eliminar.');
          }
        );
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.experienciaList,
      event.previousIndex,
      event.currentIndex
    );

    const temporal = this.experienciaList.map((item: any, index: number) => ({
      ...item,
      id: this.experienciaList_copia[index].id,
    }));
    this.datos.Drag(temporal, 'exp').subscribe(
      (data) => {
        this.experienciaList_copia = data;
        this.toastrService.success('Cambios guardados correctamente.');
      },
      (err) => {
        this.toastrService.error('Error al guardar los cambios.');
      }
    );
  }
}
