import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminUserService } from '../admin-user.service';

export interface User {
	id: number;
	name: string;
	email: string;
	role: string;
  }

@Component({
	selector: 'app-manage-users',
	standalone: true,
	imports: [
		SharedModule
	],
	templateUrl: './manage-users.component.html',
	styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {
	users: User[] = [
		{ id:0, name: '1', email: 'a@a.com', role: 'admin'}
	];
	newUser: Partial<User> = { name: '', email: '', role: ''};
	isEditing: boolean = false;
	currentUserId: number | null = null;

	constructor(private adminUserService: AdminUserService) {}

	async ngOnInit(): Promise<void> {
		await this.fetchUsers();
	}

	async fetchUsers(): Promise<void> {
		try {
			this.users = await this.adminUserService.getUsers();
			console.log(this.users);
		} catch (error) {
			console.error('Error fetching users:', error);
		}
	}



	async addUser(): Promise<void> {
		if (this.newUser.name && this.newUser.email && this.newUser.role) {
			try {
				const user = await this.adminUserService.addUser(this.newUser);
				this.users.push(user);
				this.newUser = { name: '', email: '', role: '' };
			} catch (error) {
				console.error('Error adding user:', error);
			}
		}
	}

	editUser(user: User): void {
		this.isEditing = true;
		console.log(user);
		this.currentUserId = user.id;
		this.newUser = { ...user };
	}

	async updateUser(): Promise<void> {
		if (this.currentUserId && this.newUser.name && this.newUser.email && this.newUser.role) {
			try {
				const updatedUser = await this.adminUserService.updateUser(this.currentUserId, this.newUser);
				const index = this.users.findIndex((u) => u.id === this.currentUserId);
				this.users[index] = updatedUser;
				this.cancelEdit();
			} catch (error) {
				console.error('Error updating user:', error);
			}
		}
	}

	async deleteUser(user: User): Promise<void> {
		const id = user.id;
		try {
			await this.adminUserService.deleteUser(id);
			this.users = this.users.filter((user) => user.id !== id);
		} catch (error) {
			console.error('Error deleting user:', error);
		}
	}

	cancelEdit(): void {
		this.isEditing = false;
		this.currentUserId = null;
		this.newUser = { name: '', email: '', role: '' };
	}
}
