import { RouterModule, Routes } from '@angular/router';
//Importaciones de User
import { LyoutComponent } from './User/lyout/lyout.component';
import { InicioComponent } from './Nav/inicio/inicio.component';
import { ProductosComponent } from './Nav/productos/productos.component';
import { CarritoComponent } from './Nav/carrito/carrito.component';
import { LoginComponent } from './Nav/login/login.component';
import { SuperamidComponent } from './Admin/superamid/superamid.component';
import { AuthGuard } from './Nav/login/auth.guard';
import { NgModule } from '@angular/core';
import { ModalComponent } from './shared/Componet/modal/modal.component';
import { ContactoComponent } from './Nav/contacto/contacto.component';
import { FacturaComponent } from './shared/Componet/factura/factura.component';


export const routes: Routes = [
    {
      path: 'lyou',
      component: LyoutComponent,
      children: [
        { path: 'inicio', component: InicioComponent },
        { path: 'productos', component: ProductosComponent },
        { path: 'carrito', component: CarritoComponent},
        { path: 'carrito/:id', component: CarritoComponent },
        { path: 'contactos', component: ContactoComponent },
        { path: 'login', component: LoginComponent },
        { path: '', redirectTo: 'inicio', pathMatch: 'full' },
        { path: '**', redirectTo: 'inicio' },
      ],
    },
    {
      path: 'admin',
      component: SuperamidComponent,
      canActivate: [AuthGuard],
      children:[
      { path: 'productos', component: ProductosComponent,
        children:[
          {path:'modal',component: ModalComponent},
          { path: 'modal/:id', component: ModalComponent },
        ]
       },
      { path: 'carrito', component: CarritoComponent,},
      { path: '', redirectTo: 'productos', pathMatch: 'full' },
      { path: '**', redirectTo: 'productos' },
      ]
    },
    {path: 'factura', component: FacturaComponent},
    { path: '', redirectTo: 'lyou', pathMatch: 'full' },
    { path: '**', redirectTo: 'lyou' },
  ];
  


