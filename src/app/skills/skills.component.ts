import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PortafolioService } from '../Servicios/portafolio.service';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css'],
})
export class SkillsComponent implements OnInit {
  @ViewChild('mborrar') mborrar: any;
  @ViewChild('edit') meditar: any;
  @ViewChild('crear') mcrear: any;

  Logged = false;
  form: FormGroup;
  currentUser: any;
  skillsList: any = [];
  skillsList_copia: { id: number }[] = [];
  imageSrc: any;

  constructor(
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private datos: PortafolioService
  ) {
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      texto: [''],
      color: [''],
      logo: [''],
      porcentaje: [''],
      id: [''],
      Persona_id: [''],
    });
  }

  ngOnInit(): void {
    this.datos.ObtenerDatos('skills').subscribe((data) => {
      this.skillsList = data;

      this.skillsList_copia = [...this.skillsList];
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
            .Agregar(this.currentUser.id, this.form.value, 'skills')
            .subscribe(
              (data) => {
                this.toastrService.success('Cambios guardados correctamente.');
                this.skillsList.push(data);
                this.skillsList_copia = [...this.skillsList];
              },
              (err) => {
                this.toastrService.error('Error al guardar los cambios.');
              }
            );
        }
      });
  }

  editar(index: any) {
    this.imageSrc = this.skillsList[index].logo;

    const modalRef = this.modalService
      .open(this.meditar, { centered: true })
      .result.then((result) => {
        if (this.form.valid) {
          this.datos.Editar(this.form.value, 'skills').subscribe(
            (data) => {
              this.toastrService.success('Cambios guardados correctamente.');

              this.skillsList[index] = data;
            },
            (err) => {
              this.toastrService.error('Error al guardar los cambios.');
            }
          );
        }
      });

    this.form.setValue(this.skillsList[index]);
  }

  borrar(id: number, item: any) {
    const modalRef = this.modalService
      .open(this.mborrar, { centered: true })
      .result.then((result) => {
        this.datos.eliminar(id, this.form.value, 'skills').subscribe(
          (data) => {
            this.toastrService.success('Eliminado correctamente.');

            var index = this.skillsList.indexOf(item);
            this.skillsList.splice(index, 1);
          },
          (err) => {
            this.toastrService.error('Error al eliminar.');
          }
        );
      });
  }

  drop(event: CdkDragDrop<any>) {
    this.skillsList[event.previousContainer.data.index] =
      event.container.data.item;
    this.skillsList[event.container.data.index] =
      event.previousContainer.data.item;

    const temporal = this.skillsList.map((item: any, index: number) => ({
      ...item,
      id: this.skillsList_copia[index].id,
    }));
    this.datos.Drag(temporal, 'skills').subscribe(
      (data) => {
        this.skillsList_copia = data;
        this.toastrService.success('Cambios guardados correctamente.');
      },
      (err) => {
        this.toastrService.error('Error al guardar los cambios.');
      }
    );
  }

  readURL(url: any): void {
    this.imageSrc = url;
  }

  get Nombre() {
    return this.form.get('nombre');
  }
}
