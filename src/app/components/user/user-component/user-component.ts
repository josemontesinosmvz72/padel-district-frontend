import { Component } from '@angular/core';
import { UserService } from '../../../services/user-service';
import { Usuario } from '../../../common/interfaces';


import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-user-component',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './user-component.html',
  styleUrl: './user-component.css',
})

export class UserComponent {
  usuario: Usuario;
  constructor(private userService: UserService) {
    this.usuario = this.userService.usuario;
  }
}
