import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PortafolioService } from '../Servicios/portafolio.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errorMessage!: string;
  showErrorMessage = false;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private autentificacion: PortafolioService
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(7)]],
    });
  }

  ngOnInit(): void {}

  get Email() {
    return this.form.get('email');
  }
  get Password() {
    return this.form.get('password');
  }

  onEnviar(event: Event) {
    this.showErrorMessage = false;
    if (this.form.valid) {
      event.preventDefault;
      this.autentificacion.InciarSesion(this.form.value).subscribe(
        (data) => {
          this.reloadPage();
        },
        (err) => {
          this.showErrorMessage = true;
        }
      );
    }
  }

  reloadPage(): void {
    window.location.href = '';
  }
}
