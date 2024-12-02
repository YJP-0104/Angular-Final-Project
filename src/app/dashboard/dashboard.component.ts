import { Component, OnInit , OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../shared/shared.module';
import { HttpClient } from '@angular/common/http';
// import { Editor } from 'ngx-editor';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  // editor: Editor;
  postForm: FormGroup;
  posts: any[] = [];
  userName: string;
  userId: string;
  isEditing: boolean = false;
  editingPostId: string = '';
  private authToken: string;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.userName = localStorage.getItem('user') || 'Guest'; // Changed to match registration field
    this.userId = localStorage.getItem('userId') || '';
    this.authToken = localStorage.getItem('token') || '';

    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: ['', Validators.required],
    });
    // this.editor = new Editor();
  }

  ngOnInit(): void {
    if (!this.userId) {
      this.showMessage('Please login to continue');
      return;
    }
    this.loadUserInfo();
    this.loadPosts();
  }
  ngOnDestroy(): void {
    // this.editor.destroy();
  }
  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }
  async loadUserInfo() {
    try {
      const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/users', {
        method: 'GET',
        headers: {
          'Authorization': this.authToken
        }
      });
      const userData = await response.json();
      
      if (userData.status === 'success' && Array.isArray(userData.data)) {
        const currentUser = userData.data.find((user: any) => user._id === this.userId);
        if (currentUser) {
          this.userName = currentUser.user; // Using the 'user' field from registration
          localStorage.setItem('user', currentUser.user);
        }
      }
    } catch (error) {
      console.error('Error loading user info:', error);
    }
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
        user: this.userName // Changed to match registration field
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
