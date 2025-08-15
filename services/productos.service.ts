import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  //Http service productos 

  // Obtener todos los productos
  getProduct(): Observable<any> {
    return this.http.get(`${this.apiUrl}/productos`);
  }

  // Obtener producto por ID
  getProductId(id_celular: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/productos/${id_celular}`);
  }

  // Agregar un producto
  addProduct(producto: { informacio: string,marca: string,nombre: string, precio: number  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/productos`, producto);
  }

  // Actualizar un producto por ID
  updateProduct(id_celular: number, producto: { informacio: string,marca: string,nombre: string, precio: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/productos/${id_celular}`, producto);
  }

  // Eliminar un producto por ID
  deleteProduct(id_celular: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/productos/${id_celular}`);
  }

  //Http service credito 

  // Obtener todos los credito
  getCard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/credito`);
  }

  // Obtener credito por ID
  getCardId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/credito/${id}`);
  }
  getCardUltimo(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/credito/ultimo`);
  }

  // Agregar un credito
  addCard(producto: { card_holder_name: string, card_number: string, cvv:string, valor:number, expiration_date:string,informacion:string}): Observable<any> {
    return this.http.post(`${this.apiUrl}/credito`, producto);
  }

  // Actualizar un credito por ID
  updateCard(id: number, producto: { informacio: string,marca: string,nombre: string, precio: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}/credito/${id}`, producto);
  }

  // Eliminar un credito por ID
  deleteCard(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/credito/${id}`);
  }
}
