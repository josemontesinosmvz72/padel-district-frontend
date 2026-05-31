import { Router } from '@angular/router';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../services/user-service';
import { AuthService } from '../../../../services/auth-service';
import { LoginModalService } from '../../../../services/login-modal-service';
import { RegisterModalService } from '../../../../services/register-modal-service';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RegisterComponent {
  private readonly authService = inject(AuthService);
  private readonly loginModal = inject(LoginModalService);
  private readonly registerModal = inject(RegisterModalService);
  readonly authenticated = output<void>();
  errorMessage = signal<string | null>(null);

  formRegister: FormGroup;
  passwordVisible = signal(false);

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router,
  ) {
    this.formRegister = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      avatar: [''],
      role: ['USER_ROLE', Validators.required],
    });
  }

  togglePasswordVisible(): void {
    this.passwordVisible.update((v) => !v);
  }

  openLoginModal(event: Event): void {
    event.preventDefault();
    this.registerModal.close();
    this.loginModal.open();
  }

  async register(): Promise<void> {
    if (this.formRegister.invalid) return;
    this.errorMessage.set(null);
    const valido = await this.userService.registro(this.formRegister.getRawValue());
    if (valido) {
      this.authService.setLoggedInUser(this.userService.usuario);
      this.authenticated.emit();
      await this.router.navigateByUrl('/user');
    } else {
      this.errorMessage.set('Ese correo ya existe o los datos no son válidos');
    }
  }
}
