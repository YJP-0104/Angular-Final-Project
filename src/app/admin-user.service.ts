import { Injectable } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {

  private apiUrl = 'https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/users'; // Replace with actual API URL

  constructor() {}

  // Fetch all users
  async getUsers(): Promise<User[]> {
	console.log('-fetching--')
    const response = await fetch(this.apiUrl, {
      method:'GET', 
      headers: {
        'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzMyNTk2NjY3LCJleHAiOjE3MzQ3NTY2Njd9.qU7_pZ4f2MeBbzrbJDbEsQ6zLyU3S8XEChIA8Xu0YZU'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch users. Status: ${response.status}`);
    }
    const users: User[] = await response.json();
    return users;
  }

  // Add a new user
  async addUser(user: Partial<User>): Promise<User> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error(`Failed to add user. Status: ${response.status}`);
    }
    const newUser: User = await response.json();
    return newUser;
  }

  // Update a user by ID
  async updateUser(id: number, user: Partial<User>): Promise<User> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error(`Failed to update user. Status: ${response.status}`);
    }
    const updatedUser: User = await response.json();
    return updatedUser;
  }

  // Delete a user by ID
  async deleteUser(id: number): Promise<void> {
    const response = await fetch(`${this.apiUrl}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete user. Status: ${response.status}`);
    }
  }
}
