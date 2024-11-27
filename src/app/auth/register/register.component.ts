import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
@Component({
	selector: 'app-register',
	standalone: true,
	imports: [
		SharedModule

	],
	templateUrl: './register.component.html',
	styleUrl: './register.component.css'
})
export class RegisterComponent {
	registerForm: FormGroup;
  apiUrl = 'https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/users';
  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzMyNTk2NjY3LCJleHAiOjE3MzQ3NTY2Njd9.qU7_pZ4f2MeBbzrbJDbEsQ6zLyU3S8XEChIA8Xu0YZU';
  errorMsg = ''; // To show error message if any.

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    });
  }

  // Getter for password form control
  get password() {
    return this.registerForm.get('password');
  }

  // Getter for confirm password form control
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  // Password validation: check if password meets certain criteria
  isStrongPassword(password: string): boolean {
    // At least one uppercase letter, one number, and one special character
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { password, confirmPassword, email, name } = this.registerForm.value;

      // Check if passwords match
      if (password !== confirmPassword) {
        this.errorMsg = 'Passwords do not match';
        return;
      }

      // Check if email is valid
      if (!this.isValidEmail(email)) {
        this.errorMsg = 'Invalid email format';
        return;
      }

      // Check if password is strong enough
      if (!this.isStrongPassword(password)) {
        this.errorMsg =
          'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.';
        return;
      }

      const userData = {
        user: name,
        email: email,
        pass: password,
      };

      this.registerUser(userData);
    } else {
      this.errorMsg = 'Please fill out all required fields correctly.';
    }
  }

  // Check email validity
  isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  // Register user via API using HttpClient
  registerUser(userData: any) {
    const headers = new HttpHeaders().set('Authorization', `${this.token}`);
    
    this.http
      .post(this.apiUrl, userData, { headers })
      .pipe(
        catchError((error) => {
          console.error('Error during registration:', error);
          this.errorMsg = 'An error occurred during registration. Please try again.';
          return throwError(() => new Error(error));
        })
      )
      .subscribe(
        (response) => {
          console.log('User registered successfully', response);
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('Registration failed:', error);
          this.errorMsg = 'Registration failed. Please try again later.';
        }
      );
  }
}
