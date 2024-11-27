import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  private isAuthenticated: boolean = false;

  login(email: string, password: string): boolean {
    console.log(email, password)
    if (email === 'admin@neu.edu' && password === 'password') {
      this.isAuthenticated = true;
      localStorage.setItem('token', 'admin'); // Simulating token storage
      return true;
    }
    return false;
  }

  logout(): void {
    this.isAuthenticated = false;
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return this.isAuthenticated || localStorage.getItem('token') !== null;
  }
}
