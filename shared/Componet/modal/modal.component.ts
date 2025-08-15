import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductosService } from '../../../services/productos.service';
import { ProductosComponent } from '../../../Nav/productos/productos.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit{
  form: FormGroup;
  productId: number | null = null; // ID del producto (si estamos editando)
  phoneBrands: string[] = ['Apple', 'Samsung', 'Xiaomi', 'Huawei'];

  

  constructor(private router: Router, private fb: FormBuilder, private productosservice: ProductosService, private Celular: ProductosComponent,private activatedRoute: ActivatedRoute) {
    // Inicialización del formulario con validadores
    this.form = this.fb.group({
      name: ['', Validators.required],
      info: ['', Validators.required],
      cash: [null, [Validators.required, Validators.min(1)]],
      mark: ['', Validators.required],
     // image: [null, Validators.required],  // Validación de la imagen
    });
  }
  
  
    ngOnInit(): void {
      // Capturar el ID del producto de la URL
      this.productId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  
      if (this.productId) {
        this.loadProduct(this.productId);
        
      }
    }
  
    // Cargar el producto si estamos en modo edición
    loadProduct(id: number): void {
      this.productosservice.getProductId(id).subscribe({
        next: (product) => {
          console.log('Producto cargado desde el servicio:', product); // Debugging
          this.form.setValue({
            name: product.nombre || '',
            info: product.informacio || '',
            cash: product.precio || null,
            mark: product.marca || '',
          });
          console.log(product)
        },
        error: (err) => console.error('Error al cargar el producto:', err),
      });
    }

  // Escuchar la tecla Escape para cerrar el modal
  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    this.closeModal();
  }

  // Función para cerrar el modal
  closeModal(): void {
    this.router.navigate(['admin/productos']);
  }

  // Función para manejar la selección de imagen
  /*onImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput?.files?.[0]) {
      const file = fileInput.files[0];

      // Validar el tamaño del archivo (opcional, 2 MB en este caso)
      if (file.size > 2 * 1024 * 1024) {
        alert('El archivo es demasiado grande. El tamaño máximo permitido es 2 MB.');
        return;
      }

      const reader = new FileReader();

      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;

        img.onload = () => {
          // Ajusta el tamaño de la imagen para previsualización
          const canvas = document.createElement('canvas');
          const maxWidth = 300; // Ancho máximo
          const maxHeight = 300; // Alto máximo
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height *= maxWidth / width;
              width = maxWidth;
            } else {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          this.phone.imagePreview = canvas.toDataURL('image/png');
          this.form.patchValue({ image: file }); // Actualizar el campo de imagen en el formulario
        };
      };

      reader.onerror = () => {
        console.error('Error al cargar la imagen.');
      };

      reader.readAsDataURL(file);
    } else {
      console.warn('No se seleccionó ningún archivo.');
    }
  }*/
  
  // Función para manejar el envío del formulario
  onProduc(): void {
   
    
    if (this.form.valid) {
      // Crear un objeto con los datos del formulario y la imagen previa
      const phoneData = {
        nombre: this.form.value.name,
        infomacion: this.form.value.info,
        precio: this.form.value.cash,
        marka: this.form.value.mark,
       // imagePreview: this.phone.imagePreview,  // Imagen previa
      };
      console.log('Datos a guardar:', phoneData);
      
      if (this.productId) {
        // Modo edición
        this.productosservice.updateProduct(this.productId,{informacio: phoneData.infomacion, marca: phoneData.marka,nombre: phoneData.nombre,precio: phoneData.precio } ).subscribe({
          next: () => {
            console.log('Producto actualizado');
            this.closeModal();
          },
          error: (err) => console.error('Error al actualizar el producto:', err),
        });
       
        }else{
          this.productosservice.addProduct({informacio: phoneData.infomacion, marca: phoneData.marka,nombre: phoneData.nombre,precio: phoneData.precio }).subscribe({
            next: (response) => {
              console.log('Producto agregado exitosamente:', response);
              this.Celular.loadProducts(); // Recarga la lista de productos
              this.closeModal(); // Cierra el modal
            },
            error: (err) => {
              console.error('Error al agregar producto:', err);
            },
          });
        }

      
    
      

      // Verificar en consola los datos
      console.log(this.form)

      // Obtener los datos existentes de LocalStorage o inicializar como un array vacío
      const existingData = JSON.parse(localStorage.getItem('phones') || '[]');

      // Verificar en consola los datos existentes
      console.log('Datos existentes en LocalStorage:', existingData);

      // Añadir el nuevo teléfono al array
      //existingData.push(phoneData);

      // Guardar el array actualizado en LocalStorage
      localStorage.setItem('phones', JSON.stringify(existingData));

      // Verifica que se guardó correctamente
      console.log('Datos guardados en LocalStorage:', JSON.parse(localStorage.getItem('phones') || '[]'));

      // Cerrar el modal después de guardar
      

      }else{
      // Marcar todos los campos como tocados si el formulario no es válido
      this.form.markAllAsTouched();
     }
   }

  
}

