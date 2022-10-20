import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PortafolioService } from '../Servicios/portafolio.service';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css'],
})
export class EducacionComponent implements OnInit {
  @ViewChild('mborrar') mborrar: any;
  @ViewChild('edit') meditar: any;
  @ViewChild('crear') mcrear: any;

  Logged = false;
  educacionList: any;
  form: FormGroup;
  imageSrc: any;
  currentUser: any;
  educacionList_copia: { id: number }[] = [];

  constructor(
    private toastrService: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private datos: PortafolioService
  ) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(80)]],
      logo: [''],
      texto: ['', [Validators.required, Validators.maxLength(150)]],
      fecha_inicio: [''],
      fecha_fin: [''],
      id: [''],
      Persona_id: [''],
    });
  }

  ngOnInit(): void {
    this.datos.ObtenerDatos('educacion').subscribe((data) => {
      this.educacionList = data;
      this.educacionList_copia = [...this.educacionList];
    });

    this.currentUser = this.datos.UsuarioAutenticado;
    if (this.currentUser && this.currentUser.accessToken) {
      this.Logged = true;
    } else {
      this.Logged = false;
    }
  }

  editar(index: any) {
    this.imageSrc = this.educacionList[index].logo;
    const modalRef = this.modalService
      .open(this.meditar, { centered: true })
      .result.then((result) => {
        if (this.form.valid) {
          this.datos.Editar(this.form.value, 'educacion').subscribe(
            (data) => {
              this.toastrService.success('Cambios guardados correctamente.');

              this.educacionList[index] = data;
            },
            (err) => {
              this.toastrService.error('Error al guardar los cambios.');
            }
          );
        }
      });

    this.form.setValue(this.educacionList[index]);
  }
  Crear() {
    this.form.reset();
    this.imageSrc = null;

    const modalRef = this.modalService
      .open(this.mcrear, { centered: true })
      .result.then((result) => {
        if (this.form.valid) {
          this.datos
            .Agregar(this.currentUser.id, this.form.value, 'educacion')
            .subscribe(
              (data) => {
                this.toastrService.success('Cambios guardados correctamente.');
                this.educacionList.push(data);
                this.educacionList_copia = [...this.educacionList];
              },
              (err) => {
                this.toastrService.error('Error al guardar los cambios.');
              }
            );
        }
      });
  }

  readURL(url: any): void {
    this.imageSrc = url;
  }

  borrar(id: number, item: any) {
    const modalRef = this.modalService
      .open(this.mborrar, { centered: true })
      .result.then((result) => {
        this.datos.eliminar(id, this.form.value, 'educacion').subscribe(
          (data) => {
            this.toastrService.success('Eliminado correctamente.');

            var index = this.educacionList.indexOf(item);
            this.educacionList.splice(index, 1);
          },
          (err) => {
            this.toastrService.error('Error al eliminar.');
          }
        );
      });
  }

  get Titulo() {
    return this.form.get('titulo');
  }

  get Texto() {
    return this.form.get('texto');
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.educacionList,
      event.previousIndex,
      event.currentIndex
    );

    const temporal = this.educacionList.map((item: any, index: number) => ({
      ...item,
      id: this.educacionList_copia[index].id,
    }));
    this.datos.Drag(temporal, 'educacion').subscribe(
      (data) => {
        this.educacionList_copia = data;
        this.toastrService.success('Cambios guardados correctamente.');
      },
      (err) => {
        this.toastrService.error('Error al guardar los cambios.');
      }
    );
  }
}
