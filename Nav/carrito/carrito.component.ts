import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ProductosService } from '../../services/productos.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
  form: FormGroup;
  productIds: number[] = [];
  setcard: any[] = [];
  getcard: any[] = [];
  total: number = 0;
  productDetails = '';

  constructor(
    public authService: AuthService,
    private productosService: ProductosService,
    private fb: FormBuilder,
  ) {
    // Inicialización del formulario con validadores
    this.form = this.fb.group({
      name: ['', Validators.required],
      number: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  ngOnInit(): void {
    const savedIds = localStorage.getItem('selectedProductIds');
    if (savedIds) {
      this.productIds = JSON.parse(savedIds);
    }
    this.loadcard();
    this.getCard();
  }
  
  getCard() {
    this.productosService.getCard().subscribe((response) => {
      this.getcard = response.reverse();
      this.getcard = this.getcard.map((item: any) => {
        if (item.fecha_creacion) {
          // Convertir la fecha a formato español
          item.fecha_creacion = new Date(item.fecha_creacion).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }
        return item;
      });
  
      console.log(this.getcard); // Verifica que las fechas estén en el formato correcto
    });
  }

  // Eliminar producto por ID
  deleteCard(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar informacion del cliente?')) {
      this.productosService.deleteCard(id).subscribe({
        next: () => {
          console.log(` ${id} eliminado.`);
          this.getCard(); // Recargar la lista tras eliminar
        },
        error: (err) => console.error('Error al eliminar producto:', err),
      });
    }
  }

  loadcard(): void {
    this.setcard = [];
    this.total = 0;
    this.productDetails;
    this.productIds.forEach((id) => {
      this.productosService.getProductId(id).subscribe({
        next: (setcard) => {
          if (!this.setcard.some((p) => p.id_celular === setcard.id_celular)) {
            const productWithQuantity = { ...setcard, cantidad: 1 };
            this.setcard.push(productWithQuantity);
            this.updateTotal();
            
            
          }
        },
        error: (err) => console.error('Error al cargar el producto con ID:', id, err),
      });
      
    });
    
  }

  removeFromCart(id: number): void {
    this.productIds = this.productIds.filter((productId) => productId !== id);
    localStorage.setItem('selectedProductIds', JSON.stringify(this.productIds));
    this.setcard = this.setcard.filter((setcard) => setcard.id_celular !== id);
    this.updateTotal();
  }

  incrementQuantity(product: any): void {
    product.cantidad += 1;
    this.updateTotal();
  }

  decrementQuantity(product: any): void {
    if (product.cantidad > 1) {
      product.cantidad -= 1;
      this.updateTotal();
    }
  }

  updateTotal(): void {
    this.total = this.setcard.reduce((acc, product) => acc + product.precio * product.cantidad, 0);
  }

  get isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  onCard() {
  if (this.form.valid && this.total!=0 ) {
    if(confirm("¿Desea seguir con su compra?")){
    const expiryDate = this.form.value.expiryDate; // Fecha en formato MM/DD
    const [month, year] = expiryDate.split('/'); // 'month' es el mes, 'day' es el día
    const currentYear = new Date().getFullYear(); // Año actual
    const currentMonth = new Date().getMonth() + 1; // Mes actual (1-indexed)
    const currentDay = new Date().getDate(); // Día actual
    
    // Crear la fecha de expiración utilizando el año actual
    const expirationDate = new Date(20+year, month - 1, 1); // Convertimos a Date, mes 0-indexed
    console.log(expirationDate);
    // Comparar la fecha de expiración con la fecha actual
    if (expirationDate < new Date(currentYear, currentMonth - 1, currentDay)) {
      alert('La tarjeta ha expirado');
      return; // No agregamos los datos si la fecha ha expirado
    }

    // Convertir la fecha a formato YYYY-MM-DD
    const expirationDateStr = expirationDate.toISOString().split('T')[0];

    let productDetailsString = '';
    this.setcard.forEach((product) => {
      productDetailsString += `${product.nombre}: ${product.cantidad}, `;
    });
    console.log(productDetailsString)

    const formData = {
      card_holder_name: this.form.value.name,
      card_number: this.form.value.number,
      cvv: this.form.value.cvv,
      valor: this.total,
      cantidad: this.setcard.length,
      expiration_date: expirationDateStr, // Usar la fecha completa con día, mes y año
      informacion: productDetailsString
    };

    this.productosService.addCard(formData).subscribe({
      next: (response) => {
        console.log('Producto agregado exitosamente:', response);
        
      },
      error: (err) => {
        console.error('Error al agregar producto:', err);
      },
    });
    }
    alert('Producto agregado exitosamente');
    const facturaUrl = '/factura'; // Ruta definida en tu `routes`.
    window.open(facturaUrl, '_blank');
    
  } else {
    alert('Formulario inválido');
    this.form.markAllAsTouched();
  }
}

  
  
}
