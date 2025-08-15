import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../services/productos.service';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  factura: any;

  constructor(private productosservices: ProductosService, private Tituleservis: Title) {}

  ngOnInit(): void {
    this.getUltimoCredito();
    this.Tituleservis.setTitle('Orbitel pdf');
  }

  getUltimoCredito() {
    this.productosservices.getCardUltimo().subscribe({
      next: (data) => {
        this.factura = data;
        // Formatear la fecha de creación a español
        if (this.factura.fecha_creacion) {
          const fecha = new Date(this.factura.fecha_creacion);
          const opciones = { year: 'numeric', month: 'long', day: 'numeric' } as const;
          this.factura.fecha_creacion = fecha.toLocaleDateString('es-ES', opciones);
        }
        // Formatear la fecha de expiración a español
        if (this.factura.expiration_date) {
          const fechaExp = new Date(this.factura.expiration_date);
          const opciones = { year: 'numeric', month: 'long', day: 'numeric' } as const;

          // Ajustar la fecha interpretada para evitar desajustes de zona horaria
          const fechaAjustada = new Date(fechaExp.getTime() + fechaExp.getTimezoneOffset() * 60000);
          console.log('Fecha original:', this.factura.expiration_date);
          console.log('Fecha ajustada:', fechaAjustada);
          
          this.factura.expiration_date = fechaAjustada.toLocaleDateString('es-ES', opciones);
        }
        console.log('Último crédito:', data);
      },
      error: (error) => {
        console.error('Error al obtener el último crédito:', error);
      },
    });
  }

  descargarFactura() {
    const doc = new jsPDF();

    // Título principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(30);
    doc.setTextColor('coral');
    doc.text('Orbitel', 105, 20, { align: 'center' });

    // Subtítulo
    doc.setFontSize(16);
    doc.text('Factura de Pago', 105, 30, { align: 'center' });

    // Restablecer el color para los detalles
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Negro

    if (this.factura) {
      const startY = 40;
      let offsetY = 0;

      const facturaDetails = [
        { label: 'Nombre del Titular:', value: this.factura.card_holder_name },
        { label: 'Número de Tarjeta:', value: this.factura.card_number },
        { label: 'CVV:', value: this.factura.cvv },
        { label: 'Fecha de Expiración:', value: this.factura.expiration_date },
        { label: 'Productos:', value: this.factura.informacion },
        { label: 'Valor:', value: this.factura.valor },
        { label: 'Fecha de Creación:', value: this.factura.fecha_creacion },
      ];

      facturaDetails.forEach((detail, index) => {
        doc.text(`${detail.label} ${detail.value}`, 20, startY + offsetY);
        offsetY += 10;
      });

      doc.save(`Factura_${this.factura.card_id}.pdf`);
    } else {
      console.error('No hay datos de factura disponibles.');
    }
  }
}
