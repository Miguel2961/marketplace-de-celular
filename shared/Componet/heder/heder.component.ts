import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../Nav/login/auth.service';

@Component({
  selector: 'app-heder',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './heder.component.html',
  styleUrl: './heder.component.css'
})
export class HederComponent {
  titule = 'Orbitel'
  
   constructor(private authService: AuthService, private router: Router) {}

  // Verifica si el usuario está autenticado
  get isLoggedIn():boolean {
    return this.authService.isLoggedIn();
  }

  // Maneja el logout
  logout() {
    this.authService.logout();
    this.router.navigate(['lyou/inicio']); // Redirige al inicio público después de logout
  }
}
