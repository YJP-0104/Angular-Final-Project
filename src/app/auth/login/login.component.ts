import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [SharedModule],
  standalone: true,
})
export class LoginComponent {
	hide = true;
	errorMsg = '';
	successMsg = '';
	form!: FormGroup; // Add the ! operator to tell TypeScript this will be initialized
	isResetMode = false;
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
	// private form: FormGroup,
  ) {
	
    this.initializeForm();
  }

  private initializeForm() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: [''],
      confirmPassword: ['']
    });

    if (this.isResetMode) {
      this.form.get('newPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('confirmPassword')?.setValidators([Validators.required]);
    } else {
      this.form.get('newPassword')?.clearValidators();
      this.form.get('confirmPassword')?.clearValidators();
    }
    
    this.form.get('newPassword')?.updateValueAndValidity();
    this.form.get('confirmPassword')?.updateValueAndValidity();
  }
  toggleResetMode() {
	this.isResetMode = !this.isResetMode;
	this.errorMsg = '';
	this.successMsg = '';
	
	// Reset form with proper validators
	if (this.isResetMode) {
	  this.form.patchValue({
		password: '',
		newPassword: '',
		confirmPassword: ''
	  });
	  this.form.get('password')?.clearValidators();
	  this.form.get('newPassword')?.setValidators([Validators.required, Validators.minLength(6)]);
	  this.form.get('confirmPassword')?.setValidators([Validators.required]);
	} else {
	  this.form.patchValue({
		password: '',
		newPassword: '',
		confirmPassword: ''
	  });
	  this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
	  this.form.get('newPassword')?.clearValidators();
	  this.form.get('confirmPassword')?.clearValidators();
	}
	
	// Update all form controls validity
	Object.keys(this.form.controls).forEach(key => {
	  const control = this.form.get(key);
	  control?.updateValueAndValidity();
	});
  }

  validateResetForm(): boolean {
    const email = this.form.get('email');
    const newPassword = this.form.get('newPassword');
    const confirmPassword = this.form.get('confirmPassword');

    if (!email?.valid) {
      this.errorMsg = 'Please enter a valid email address';
      return false;
    }

    if (!newPassword?.value) {
      this.errorMsg = 'Please enter a new password';
      return false;
    }

    if (newPassword.value.length < 6) {
      this.errorMsg = 'Password must be at least 6 characters long';
      return false;
    }

    if (newPassword.value !== confirmPassword?.value) {
      this.errorMsg = 'Passwords do not match';
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (this.isResetMode) {
      if (this.validateResetForm()) {
        this.handlePasswordReset();
      }
    } else {
      if (this.form.valid) {
        this.handleLogin();
      }
    }
  }


  private handlePasswordReset() {
	console.log('Reset Mode:', this.isResetMode);
	console.log('Form Valid:', this.form.valid);
	console.log('Form Values:', this.form.value);
    if (this.validateResetForm()) {
      const email = this.form.get('email')?.value;
      const newPassword = this.form.get('newPassword')?.value;

      this.authService.resetPassword(email, newPassword).subscribe({
        next: () => {
          this.successMsg = 'Password has been successfully updated';
          setTimeout(() => {
            this.toggleResetMode();
          }, 2000);
        },
        error: (error) => {
          this.errorMsg = error.message || 'Error updating password. Please try again';
        }
      });
    }
  }
  private handleLogin() {
	console.log('Form Valid:', this.form.valid);
	console.log('Form Values:', this.form.value);
	
	if (this.form.valid) {
	  const { email, password } = this.form.value;
	  this.authService.login(email, password).subscribe({
		next: (success) => {
		  console.log('Login Response:', success);
		  if (success) {
			this.router.navigate(['/dashboard']);
		  }
		},
		error: (error) => {
		  console.error('Login Error:', error);
		  this.errorMsg = error.message || 'Login failed. Please try again.';
		}
	  });
	}
  }
}