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
  userId: string = localStorage.getItem('userId') || '';
  isEditing: boolean = false;
  editingPostId: string = '';
  private authToken: string = localStorage.getItem('token') || '';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (!this.userId) {
      this.showMessage('Please login to continue');
      return;
    }
    this.loadPosts();
  }
  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  
  async loadPosts() {
    try {
      const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/blogs', {
        method: 'GET',
        headers: {
          'Authorization': this.authToken
        }
      });
      const responseData = await response.json();

      if (responseData.status === 'success' && Array.isArray(responseData.data)) {
        const userPosts = responseData.data.filter((post: any) => post.userId === this.userId);
        this.posts = userPosts.map((post: any) => ({
          title: post.title,
          content: post.content,
          timestamp: post.timestamp,
          date: post.date,
          tags: Array.isArray(post.tags) ? post.tags : [],
          _id: post._id,
          userId: post.userId
        }));
      }
    } catch (error) {
      this.showMessage('Error loading posts');
      console.error(error);
    }
  }


  async onSubmit() {
    if (this.postForm.valid) {
      const postData = {
        title: this.postForm.value.title,
        content: this.postForm.value.content,
        tags: this.postForm.value.tags.split(',').map((tag: string) => tag.trim()),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('en-GB'),
        userId: this.userId,
        userName: this.userName
      };

      try {
        const url = this.isEditing
          ? `https://smooth-comfort-405104.uc.r.appspot.com/document/updateOne/blogs/${this.editingPostId}`
          : 'https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/blogs';

        const response = await fetch(url, {
          method: this.isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.authToken
          },
          body: JSON.stringify(postData)
        });

        if (response.ok) {
          this.showMessage(this.isEditing ? 'Post updated successfully' : 'Post created successfully');
          this.postForm.reset();
          this.isEditing = false;
          this.editingPostId = '';
          this.loadPosts();
        }
      } catch (error) {
        this.showMessage('Error saving post');
      }
    }
  }

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

  editPost(post: any) {
    this.isEditing = true;
    this.editingPostId = post._id;
    this.postForm.patchValue({
      title: post.title,
      content: post.content,
      tags: post.tags.join(', ')
    });
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingPostId = '';
    this.postForm.reset();
  }
}
