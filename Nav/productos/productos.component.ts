import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  data: any[] = []; // Array para almacenar los productos
  selectedProductIds: number[] = []; // Array para almacenar los IDs de los productos seleccionados

  constructor(public authService: AuthService, private productosservice: ProductosService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Cargar productos al iniciar
  loadProducts() {
    this.productosservice.getProduct().subscribe((response) => {
      this.data = response;
    });
  }

  // Eliminar producto por ID
  deleteProduct(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productosservice.deleteProduct(id).subscribe({
        next: () => {
          console.log(`Producto con ID ${id} eliminado.`);
          this.loadProducts(); // Recargar la lista tras eliminar
        },
        error: (err) => console.error('Error al eliminar producto:', err),
      });
    }
  }

  // Función para agregar el producto al carrito
  addToCart(id: number): void {
    const savedIds = localStorage.getItem('selectedProductIds');
    const productIds = savedIds ? JSON.parse(savedIds) : [];

    // Validar si el producto ya está en el carrito
    if (productIds.includes(id)) {
      alert('Este producto ya está en el carrito.');
      return; // Salir si el producto ya existe
    }

    // Si no está duplicado, agregar el ID y guardar en LocalStorage
    productIds.push(id);
    localStorage.setItem('selectedProductIds', JSON.stringify(productIds));

    alert('Producto agregado al carrito.');
    console.log(`Producto con ID ${id} agregado al carrito.`);
  }

  // Getter para verificar si el usuario está autenticado
  get isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }
}
