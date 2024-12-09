import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError , switchMap } from 'rxjs';
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
          localStorage.setItem('userName', user.title || email.split('@')[0]); // Fallback to email username if title is not available
          return true;
        } else {
          throw new Error('Invalid email or password');
        }
      })
    );
}

resetPassword(email: string, newPassword: string): Observable<string> {
  const headers = new HttpHeaders({
    Authorization: `${this.token}`,
    'Content-Type': 'application/json',
  });

  return this.http.get<any>(this.apiUrl, { headers }).pipe(
    map((data) => {
      if (!Array.isArray(data.data)) {
        throw new Error('Invalid API response format');
      }

      const user = data.data.find((u: any) => u.email === email);

      if (!user) {
        throw new Error('No user found with that email address');
      }

      return user._id;
    }),
    switchMap((userId) =>
      this.http.put<any>(
        `https://smooth-comfort-405104.uc.r.appspot.com/document/updateOne/users/${userId}`,
        { pass: newPassword },
        { headers }
      )
    ),
    map((response) => {
      if (response.status === 'success') {
        return 'Password has been successfully updated';
      } else {
        throw new Error(response.message || 'Error updating password');
      }
    }),
    catchError((error) => {
      console.error('Password reset error:', error);
      return throwError(() => new Error(error.message || 'Error updating password'));
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