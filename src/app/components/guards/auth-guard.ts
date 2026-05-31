import { CanActivateFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../../services/auth-service";
import { LoginModalService } from "../../services/login-modal-service";

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const loginModal = inject(LoginModalService);

  if (authService.isAuthenticated()) {
    return true;
  }
  void router.navigate(['/inicio']);
  loginModal.open();
  return false;
};