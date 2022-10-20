import { Component, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PortafolioService } from '../Servicios/portafolio.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  Logged = false;

  constructor(
    private autentificador: PortafolioService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.Logged = false;

    var currentUser = this.autentificador.UsuarioAutenticado;
    if (currentUser && currentUser.accessToken) {
      this.Logged = true;
    } else {
      this.Logged = false;
    }
  }

  openLoginForm(): void {
    const modalRef = this.modalService.open(LoginComponent, { centered: true });
  }

  logout(): void {
    this.autentificador.clear();
    window.location.reload();
  }
}
