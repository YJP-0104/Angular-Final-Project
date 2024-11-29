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
  userName: string = localStorage.getItem('userName') || 'Anonymous';
  isEditing: boolean = false;
  editingPostId: string = '';

  private authToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzMyNTk2NjY3LCJleHAiOjE3MzQ3NTY2Njd9.qU7_pZ4f2MeBbzrbJDbEsQ6zLyU3S8XEChIA8Xu0YZU';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: ['', Validators.required], // Input tags as a comma-separated string
    });
  }

  ngOnInit() {
    this.loadPosts();
  }

  // Load posts from the API
  async loadPosts() {
    try {
      const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/blogs', {
        method: 'GET',
        headers: {
          'Authorization': `${this.authToken}`
        }
      });
      const responseData = await response.json();
  
      if (responseData.status === 'success' && Array.isArray(responseData.data)) {
        this.posts = responseData.data.map((post: any) => ({
          title: post.title,
          content: post.content,
          timestamp: post.timestamp,
          date: post.date,
          tags: Array.isArray(post.tags) ? post.tags : [],
          _id: post._id,
        }));
      } else {
        this.showMessage('No posts found.');
        this.posts = [];
      }
    } catch (error) {
      this.showMessage('Error loading posts');
      console.error(error);
    }
  }
  
  
  // Handle form submission for creating or editing a post
  async onSubmit() {
    if (this.postForm.valid) {
      const postData = {
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        tags: this.postForm.value.tags.split(',').map((tag: string) => tag.trim()), // Convert tags to an array
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-GB'),
      };

      try {
        const url = this.isEditing
          ? `https://smooth-comfort-405104.uc.r.appspot.com/document/updateOne/blogs/${this.editingPostId}`
          : 'https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/blogs';

        const response = await fetch(url, {
          method: this.isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${this.authToken}`
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

  // Delete a post
  async deletePost(postId: string) {
    try {
      const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/deleteOne/blogs/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `${this.authToken}`
        }
      });

      if (response.ok) {
        this.showMessage('Post deleted successfully');
        this.loadPosts();
      } else {
        this.showMessage('Error deleting post');
      }
    } catch (error) {
      this.showMessage('Error deleting post');
    }
  }

  // Edit an existing post
  editPost(post: any) {
    this.isEditing = true;
    this.editingPostId = post._id;
    this.postForm.patchValue({
      title: post.title,
      content: post.content,
      tags: post.tags.join(', '), // Convert array to a comma-separated string
    });
  }

  // Cancel editing
  cancelEdit(): void {
    this.isEditing = false;
    this.editingPostId = '';
    this.postForm.reset();
  }

  // Show a snack bar message
  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
    });
  }
}
