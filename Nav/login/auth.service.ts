import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Este servicio se sigue proporcionando a nivel global
})
export class AuthService {

  constructor() { }

  // Lógica de login
  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      localStorage.setItem('user', 'true'); // Guardamos el estado de autenticación
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('user'); // Eliminamos el estado de autenticación
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('user') === 'true'; // Verificamos si el usuario está autenticado
  }
}
