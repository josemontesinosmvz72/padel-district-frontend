import { Routes } from '@angular/router';
import { Inicio } from './components/web/inicio/inicio';
import { Ayuda } from './components/web/footer-components/ayuda/ayuda';
import { Faqs } from './components/web/footer-components/faqs/faqs';
import { GuiaTallas } from './components/web/footer-components/guia-tallas/guia-tallas';
import { CambiosDevoluciones } from './components/web/footer-components/cambios-devoluciones/cambios-devoluciones';
import { QuienesSomos } from './components/web/footer-components/quienes-somos/quienes-somos';
import { Novedades } from './components/web/footer-components/novedades/novedades';
import { About } from './components/web/footer-components/about/about';
import { PadelDetail } from './components/web/padel-detail/padel-detail';
import { ComponenteArticulosNavbar } from './components/web/componente-articulos-navbar/componente-articulos-navbar';
import { CartPage } from './components/web/cart-page/cart-page';
import { userGuard } from './components/guards/user-guards';
import { adminGuard } from './components/guards/admin-guard';
import { UserComponent } from './components/user/user-component/user-component';
import { RerservasPistas } from './components/web/rerservas-pistas/rerservas-pistas';
import { GestionArticulos } from './components/web/gestion-articulos/gestion-articulos';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full',
    },
    {
        path: 'inicio',
        component: Inicio,
    },
    {
        path: 'categoria/:categoria',
        component: ComponenteArticulosNavbar,
    },
    {
        path: 'subcategoria/:subcategoria',
        component: ComponenteArticulosNavbar,
    },
    {
        path: 'cart-list',
        component: CartPage,
    },
    {
        path: 'ayuda',
        component: Ayuda
    },
    {
        path: 'faqs',
        component: Faqs
    },
    {
        path: 'guia/tallas',
        component: GuiaTallas
    },
    {
        path: 'cambios/devoluciones',
        component: CambiosDevoluciones
    },
    {
        path: 'quienes/somos',
        component: QuienesSomos
    },
    {
        path: 'novedades',
        component: Novedades
    },
    {
        path: 'about',
        component: About
    },
    {
        path: 'detalle/:id',
        component: PadelDetail
    },
    {
        path: 'login',
        redirectTo: 'inicio',
        pathMatch: 'full',
    },
    {
        path: 'user',
        canMatch: [userGuard],
        component: UserComponent,
    },
    {
        path: 'reservas-pistas',
        canMatch: [userGuard],
        component: RerservasPistas
    },
    {
        path: 'gestion-articulos',
        canMatch: [adminGuard],
        component: GestionArticulos
    }
];
