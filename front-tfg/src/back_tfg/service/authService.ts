import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn: boolean = false;

  constructor() {}

  login(email: string, password: string): boolean {
    // Aquí puedes agregar la lógica para comprobar las credenciales
    // Supongamos que siempre es exitoso por ahora:
    this.loggedIn = true;
    localStorage.setItem('loggedIn', 'true');
    return this.loggedIn;
  }

  logout(): void {
    this.loggedIn = false;
    localStorage.removeItem('loggedIn');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('loggedIn') === 'true';
  }
}