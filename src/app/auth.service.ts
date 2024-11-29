import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/users';
  private token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzMyNTk2NjY3LCJleHAiOjE3MzQ3NTY2Njd9.qU7_pZ4f2MeBbzrbJDbEsQ6zLyU3S8XEChIA8Xu0YZU';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<boolean> {
    const headers = new HttpHeaders({
      Authorization: `${this.token}`,
      'Content-Type': 'application/json',
    });

    return this.http.get<any>(this.apiUrl, { headers }).pipe(
      map((data) => {
        if (!Array.isArray(data.data)) {
          throw new Error('Invalid API response format');
        }

        const user = data.data.find(
          (u: any) => u.email === email && u.pass === password
        );

        if (user) {
          localStorage.setItem('token', this.token);
          localStorage.setItem('userId', user._id);
          localStorage.setItem('userName', user.title); // Store username
          return true;
        } else {
          throw new Error('Invalid email or password');
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => new Error('Login failed. Please try again.'));
      })
    );
  }
  logout(): void {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') !== null;
  }
}
