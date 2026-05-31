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
import { UserService } from '../../../../services/user-service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../services/auth-service';
import { LoginModalService } from '../../../../services/login-modal-service';
import { RegisterModalService } from '../../../../services/register-modal-service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly loginModal = inject(LoginModalService);
  private readonly registerModal = inject(RegisterModalService);
  readonly authenticated = output<void>();
  errorMessage = signal<string | null>(null);
  isLoading = signal(false);

  formUser: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly userService: UserService,
    private readonly router: Router,
  ) {
    this.formUser = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  passwordVisible = signal(false);

  togglePasswordVisible(): void {
    this.passwordVisible.update((v) => !v);
  }

  get password() {
    return this.formUser.get('password');
  }
  get email() {
    return this.formUser.get('email');
  }

  openRegisterModal(event: Event): void {
    event.preventDefault();
    this.loginModal.close();
    this.registerModal.open();
  }

  async login(): Promise<void> {
    if (this.formUser.invalid) return;
    this.errorMessage.set(null);
    const valido = await this.userService.login(
      this.email?.value,
      this.password?.value,
    );
    if (valido) {
      this.authService.setLoggedInUser(this.userService.usuario);
      this.authenticated.emit();
      await this.router.navigateByUrl('/user');
    } else {
      this.errorMessage.set('Usuario y contraseña incorrectos');
    }
  }

  opnSubmit(data: any) {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.authService.login(data.email, data.password).subscribe({
      next: () => {
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.message);
        this.isLoading.set(false);
      },
    });
  }
}
