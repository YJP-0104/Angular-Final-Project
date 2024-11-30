import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { SharedModule } from '../../shared/shared.module';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	standalone: true,
	imports: [
		SharedModule
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',

	animations: [
		trigger('fadeInOut', [
		  transition(':enter', [
			style({ opacity: 0, transform: 'translateY(-10px)' }),
			animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
		  ]),
		  transition(':leave', [
			animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
		  ])
		])
	  ]
})
export class LoginComponent {
	hide = true;
	errorMsg = '';
	form: FormGroup;
  
	constructor(
	  private authService: AuthService,
	  private router: Router,
	  private fb: FormBuilder
	) {
	  this.form = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]],
	  });
	}
  
	get password() {
	  return this.form.get('password');
	}
  
	get email() {
	  return this.form.get('email');
	}
  
	getErrorMessage(field: string): string {
	  const control = this.form.get(field);
  
	  if (control?.hasError('required')) {
		return 'You must enter a value';
	  }
  
	  if (field === 'email' && control?.hasError('email')) {
		return 'Not a valid email';
	  }
  
	  if (field === 'password' && control?.hasError('minlength')) {
		return 'Password must be at least 6 characters';
	  }
  
	  return '';
	}
  
	onLogin(): void {
		if (this.form.valid) {
		  const { email, password } = this.form.value;
	  
		  this.authService.login(email, password).subscribe({
			next: (success) => {
			  if (success) {
				console.log('Login successful');
				this.router.navigate(['/dashboard']);
			  }
			},
			error: (error) => {
			  this.errorMsg = error.message || 'Login failed. Please try again.';
			  console.error('Login error:', error);
			},
		  });
		} else {
		  this.errorMsg = 'Please fill in all required fields correctly.';
		}
	  }
}