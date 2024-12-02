import { Component, OnInit, HostListener } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  blogs: any[] = [];
  filteredBlogs: any[] = [];
  searchTerm: string = '';
  commentForm: FormGroup;
  private authToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzMyNTk2NjY3LCJleHAiOjE3MzQ3NTY2Njd9.qU7_pZ4f2MeBbzrbJDbEsQ6zLyU3S8XEChIA8Xu0YZU';

  constructor(private fb: FormBuilder) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBlogsWithComments();
  }

  filterBlogs(searchTerm: string) {
    this.searchTerm = searchTerm.toLowerCase();
    if (!this.searchTerm) {
      this.filteredBlogs = this.blogs;
    } else {
      this.filteredBlogs = this.blogs.filter(blog => 
        blog.tags.some((tag: string) => 
          tag.toLowerCase().includes(this.searchTerm)
        )
      );
    }
  }

  async loadBlogsWithComments() {
    try {
      const [blogsResponse, commentsResponse] = await Promise.all([
        fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/blogs', {
          method: 'GET',
          headers: { 'Authorization': this.authToken }
        }),
        fetch('https://smooth-comfort-405104.uc.r.appspot.com/document/findAll/comments', {
          method: 'GET',
          headers: { 'Authorization': this.authToken }
        })
      ]);

      const blogsData = await blogsResponse.json();
      const commentsData = await commentsResponse.json();

      if (blogsData.status === 'success' && commentsData.status === 'success') {
        const comments = commentsData.data || [];
        
        this.blogs = blogsData.data.map((blog: any) => ({
          ...blog,
          comments: comments.filter((comment: any) => comment.blogId === blog._id)
            .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        }));

        this.filteredBlogs = this.blogs;
        localStorage.setItem('blogsWithComments', JSON.stringify(this.blogs));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      const cachedData = localStorage.getItem('blogsWithComments');
      if (cachedData) {
        this.blogs = JSON.parse(cachedData);
        this.filteredBlogs = this.blogs;
      }
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
          const blogIndex = this.blogs.findIndex(blog => blog._id === blogId);
          if (blogIndex !== -1) {
            this.blogs[blogIndex].comments.unshift(commentData);
            localStorage.setItem('blogsWithComments', JSON.stringify(this.blogs));
          }

          this.commentForm.reset();
          await this.loadBlogsWithComments();
        }
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    }
  }

  @HostListener('window:beforeunload')
  saveState() {
    localStorage.setItem('blogsWithComments', JSON.stringify(this.blogs));
  }
}
