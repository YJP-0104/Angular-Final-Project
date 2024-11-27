import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './auth.service';


@Component({
	selector: 'app-root',
	standalone: true,
	imports: [
		RouterOutlet,
		SharedModule,
		RouterLink
	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent {
	title = 'INFO-6150-final-project';
	constructor(
		private authService:AuthService,
		private router:Router
	){}
	isLoggedIn(){
		return this.authService.isLoggedIn();
	}
	
	onLogout(){
		this.authService.logout();

		this.router.navigate(['/']).then(() => {
			console.log('Navigation to home successful');
		}).catch(err => {
			console.error('Navigation error:', err);
		});	}
}
