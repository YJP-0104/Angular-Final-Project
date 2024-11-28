import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../shared/shared.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  postForm: FormGroup;
  posts: any[] = [];
  userName: string = localStorage.getItem('userName') || '';
  isEditing: boolean = false;
  editingPostId: string = '';

  // The JWT token that you want to add to your requests
  private authToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzMyNTk2NjY3LCJleHAiOjE3MzQ3NTY2Njd9.qU7_pZ4f2MeBbzrbJDbEsQ6zLyU3S8XEChIA8Xu0YZU';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: ['', Validators.required]  // Tags will still be a comma-separated string for input
    });
  }

  ngOnInit() {
    this.loadPosts();
  }

  // Fetch posts from the API
  async loadPosts() {
    try {
      const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/blogs', {
        headers: {
          'Authorization': `${this.authToken}`
        }
      });
      const data = await response.json();

      // Assuming the API response has a 'posts' property or check if 'data' is an array
      if (Array.isArray(data)) {
        this.posts = data;
      } else if (data && Array.isArray(data.posts)) {
        this.posts = data.posts; // Access 'posts' array from response object
      } else {
        this.posts = []; // Default to an empty array if no valid posts found
      }

    } catch (error) {
      this.showMessage('Error loading posts');
    }
  }

  // Handle form submission for creating or editing a post
  async onSubmit() {
    if (this.postForm.valid) {
      const postData = {
        ...this.postForm.value,
        userId: localStorage.getItem('userId'),
        author: this.userName,  // 'author' field now instead of 'userName'
        tags: this.postForm.value.tags.split(',').map((tag: string) => tag.trim()),  // Explicitly type 'tag' as string
        timestamp: new Date().toISOString(), // Add timestamp
        date: new Date().toLocaleDateString('en-GB') // Format date as DD/MM/YYYY
      };

      try {
        const url = this.isEditing 
          ? `https://smooth-comfort-405104.uc.r.appspot.com/document/updateOne/blogs/${this.editingPostId}`
          : 'https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/blogs';

        const response = await fetch(url, {
          method: this.isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${this.authToken}` // Add Authorization header
          },
          body: JSON.stringify(postData)
        });

        if (response.ok) {
          this.showMessage(this.isEditing ? 'Post updated successfully' : 'Post created successfully');
          this.postForm.reset();
          this.isEditing = false;
          this.editingPostId = '';
          this.loadPosts();
        } else {
          this.showMessage('Error saving post');
        }
      } catch (error) {
        this.showMessage('Error saving post');
      }
    }
  }

  // Delete a post by its ID
  async deletePost(postId: string) {
    try {
      const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/deleteOne/blogs/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${this.authToken}` // Add Authorization header
        }
      });

      if (response.ok) {
        this.showMessage('Post deleted successfully');
        this.loadPosts();
      }
    } catch (error) {
      this.showMessage('Error deleting post');
    }
  }

  // Populate the form to edit a post
  editPost(post: any) {
    this.isEditing = true;
    this.editingPostId = post._id;
    this.postForm.patchValue({
      title: post.title,
      content: post.content,
      tags: post.tags.join(', ')  // Join array tags as a comma-separated string
    });
  }

  // Cancel editing and reset the form
  cancelEdit(): void {
    this.isEditing = false;
    this.postForm.reset();
  }

  // Show a snack bar message
  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
