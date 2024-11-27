import { Component } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';

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
	styleUrl: './login.component.css'
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




	getErrorMessage(field: string) {
		const control = this.form.get(field);

		if (control?.hasError('required')) {
			return 'You must enter a value';
		}

		if (field === 'email' && control?.hasError('email')) {
			return 'Not a valid email';
		}

		if (field === 'password' && control?.hasError('minlength')) {
			return 'Password must be at least 8 characters';
		}

		return '';
	}

	onLogin(): void {
		console.log('-----')

		if (this.form.valid) {
			const { email, password } = this.form.value;
			const isValid = this.authService.login(email, password);

			if (isValid) {
				console.log('Login successful:', email);
				this.router.navigate(['/dashboard']).then(() => {
					console.log('Navigation to dashboard successful');
				}).catch(err => {
					console.error('Navigation error:', err);
				});
			} else {
				this.errorMsg = 'Invalid credentials. Please try again.';
				console.log('Login failed:', email);
			}
		} else {
			this.errorMsg = 'Please fill in all required fields correctly.';
			console.log('Form is invalid');
		}
	}
}
