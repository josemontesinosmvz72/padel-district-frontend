import { CanMatchFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { AuthService } from "../../services/auth-service";
import { ToastService } from "../../services/toast-service";

export const adminGuard: CanMatchFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const toast = inject(ToastService);

    const user = authService.user();

    if (user && user.role === 'ADMIN_ROLE') {
        return true;
    }

    toast.show('Acceso denegado: solo los administradores pueden acceder a esta sección.');
    void router.navigate(['/inicio']);
    return false;
};
