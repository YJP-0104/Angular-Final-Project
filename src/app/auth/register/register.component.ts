import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
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

	constructor(private fb: FormBuilder) {
		this.registerForm = this.fb.group({
			name: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required, Validators.minLength(6)]],
		});
	}

	  // Getter methods for easy access to form controls
	  get password() {
		return this.registerForm.get('password');
	  }

	onSubmit() {
		if (this.registerForm.valid) {
			console.log('Form Submitted:', this.registerForm.value);
			// You can call your backend API here
		} else {
			console.log('Form is invalid');
		}
	}

}
