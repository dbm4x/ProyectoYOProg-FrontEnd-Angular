import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PortafolioService } from '../Servicios/portafolio.service';


interface Item {
  id: number;
  logo: string;
}


@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

   
  @ViewChild('mborrar') mborrar: any;
  @ViewChild('edit') meditar: any;
  @ViewChild('crear') mcrear: any;

  Logged = false;
  form: FormGroup;
  currentUser: any;
  proyectosList: any = [];
  proyectosList_copia: { id: number }[] = [];
  imageSrc: any;

  constructor( private toastrService: ToastrService,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private datos: PortafolioService) {

      this.form = this.fb.group({
        titulo: ['', [Validators.required]],
        texto: [''],
        subtitulo: [''],
        logo: [''],
        link: [''],
        id: [''],
        fecha_inicio: [''],
        fecha_fin: [''],
        Persona_id: [''],
        proyectoLogo: this.fb.array([])

      });
      
   }



   get formArr() {
    return this.form.get("proyectoLogo") as FormArray;
  }




  ngOnInit(): void {
    this.datos.ObtenerDatos('proyectos').subscribe((data) => {


      this.proyectosList = data;
     
      this.proyectosList_copia = [...this.proyectosList];

      this.proyectosList.map((data: any) => {

        data['proyectoLogo'].map((item: Item, i: number) => {
  
        
          let fg = this.fb.group({});
          fg.addControl("logo", this.fb.control(false));
          fg.addControl("id", this.fb.control(false));
          this.formArr.push(fg);
        
        })
        })
    })


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
    this.formArr.clear();
   

    const modalRef = this.modalService
      .open(this.mcrear, { centered: true })
      .result.then((result) => {

        console.log(this.form.value)
        
        if (this.form.valid) {

          this.datos
            .Agregar(this.currentUser.id, this.form.value, 'proyectos')
            .subscribe(
              (data) => {
            
                this.toastrService.success('Cambios guardados correctamente.');
               
                this.proyectosList.push(data);
                this.proyectosList_copia = [...this.proyectosList];
                
              },
              (err) => {
                this.toastrService.error('Error al guardar los cambios.');
              }
            );
        }
      });
  }

  BorrarImagenes(index: any) {
    this.formArr.removeAt(index);
}

  AgregarImagenes() {
    this.formArr.push(
      new FormGroup({
        id: new FormControl(''),
        logo: new FormControl('')
      })
    );
  }

  editar(index: any) {

    this.formArr.clear();
    this.imageSrc = this.proyectosList[index].logo;

    this.proyectosList.map((data: any) => {

      data['proyectoLogo'].map((item: Item, i: number) => {

        if(this.proyectosList[index].id === data.id) {
        let fg = this.fb.group({});
        fg.addControl("logo", this.fb.control(false));
        fg.addControl("id", this.fb.control(false));
        this.formArr.push(fg);
      }
      })
      })

    const modalRef = this.modalService
      .open(this.meditar, { centered: true })
      .result.then((result) => {
          console.log(this.form.value)
       if (this.form.valid) {
          this.datos.Editar(this.form.value, 'proyectos').subscribe(
            (data) => {
              this.toastrService.success('Cambios guardados correctamente.');

              this.proyectosList[index] = data;
            },
            (err) => {
              this.toastrService.error('Error al guardar los cambios.');
            }
          );
        }
      });

      this.form.patchValue(this.proyectosList[index]);

  }

  borrar(id: number, item: any) {
    const modalRef = this.modalService
      .open(this.mborrar, { centered: true })
      .result.then((result) => {
        this.datos.eliminar(id, this.form.value, 'proyectos').subscribe(
          (data) => {
            this.toastrService.success('Eliminado correctamente.');

            var index = this.proyectosList.indexOf(item);
            this.proyectosList.splice(index, 1);
          },
          (err) => {
            this.toastrService.error('Error al eliminar.');
          }
        );
      });
  }


  drop(event: CdkDragDrop<any>) {
    
  

    this.proyectosList[event.previousContainer.data.index] =
      event.container.data.item;
    this.proyectosList[event.container.data.index] =
      event.previousContainer.data.item;
    
        
    const temporal = this.proyectosList.map((item: any, index: number) => ({
      ...item,
      id: this.proyectosList_copia[index].id,
    }));
    
    console.log(temporal);
    
    this.datos.Drag(temporal, 'proyectos').subscribe(
      (data) => {
   
        this.proyectosList = data;
        this.proyectosList_copia = [...this.proyectosList];

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

  get Titulo() {
    return this.form.get('titulo');
  }

}
