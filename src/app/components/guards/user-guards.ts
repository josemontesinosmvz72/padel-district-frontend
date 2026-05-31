import { CanMatchFn } from "@angular/router";
import { UserService } from "../../services/user-service"
import { inject } from "@angular/core";


export const userGuard: CanMatchFn = (route, state) => {
    const userService = inject(UserService);
    return userService.validaToken();
}