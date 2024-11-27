
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedModule } from '../shared/shared.module';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  postForm: FormGroup;
  posts: any[] = [];
  userName: string = localStorage.getItem('userName') || '';
  isEditing: boolean = false;
  editingPostId: string = '';

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      tags: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadPosts();
  }

  async loadPosts() {
    try {
      const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/blog/');
      const data = await response.json();
      this.posts = data;
    } catch (error) {
      this.showMessage('Error loading posts');
    }
  }

  async onSubmit() {
    if (this.postForm.valid) {
      const postData = {
        ...this.postForm.value,
        userId: localStorage.getItem('userId'),
        userName: this.userName
      };

      try {
        const url = this.isEditing 
          ? `https://smooth-comfort-405104.uc.r.appspot.com/document/updateOne/blog/${this.editingPostId}`
          : 'https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/blog';

        const response = await fetch(url, {
          method: this.isEditing ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json'
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
      const response = await fetch(`https://smooth-comfort-405104.uc.r.appspot.com/document/deleteOne/blog/${postId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        this.showMessage('Post deleted successfully');
        this.loadPosts();
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
      tags: post.tags
    });
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000
    });
  }
}
