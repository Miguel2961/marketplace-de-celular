import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Si el usuario ya está autenticado, redirigir a 'home'
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['admin/productos']);
    }
  }

  onLogin(): void {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['admin/productos']); // Redirige a la página protegida
    } else {
      this.errorMessage = 'Invalid username or password'; // Muestra error
    }
  }
}
