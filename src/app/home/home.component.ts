import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  blogs: any[] = [];
  commentForm: FormGroup;
  private authToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzMyNTk2NjY3LCJleHAiOjE3MzQ3NTY2Njd9.qU7_pZ4f2MeBbzrbJDbEsQ6zLyU3S8XEChIA8Xu0YZU';

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBlogs();
    this.loadAllComments();
  }

  async loadBlogs() {
    try {
      const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/blogs', {
        method: 'GET',
        headers: {
          'Authorization': this.authToken
        }
      });
      const data = await response.json();

      if (data.status === 'success' && Array.isArray(data.data)) {
        this.blogs = data.data.map((blog: any) => ({
          ...blog,
          comments: []
        }));
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    }
  }

  async loadAllComments() {
    try {
      const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/comments', {
        method: 'GET',
        headers: {
          'Authorization': this.authToken
        }
      });
      const data = await response.json();

      if (data.status === 'success' && Array.isArray(data.data)) {
        // Map comments to their respective blogs
        this.blogs = this.blogs.map(blog => ({
          ...blog,
          comments: data.data.filter((comment: any) => comment.blogId === blog._id)
        }));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  }

  async addComment(blogId: string) {
    if (this.commentForm.valid) {
      const commentData = {
        text: this.commentForm.value.comment,
        blogId: blogId,
        userId: localStorage.getItem('userId'),
        userName: localStorage.getItem('userName') || 'Anonymous',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
      };

      try {
        const response = await fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/createorupdate/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': this.authToken
          },
          body: JSON.stringify(commentData)
        });

        if (response.ok) {
          this.commentForm.reset();
          await this.loadAllComments();
        }
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    }
  }  
}
