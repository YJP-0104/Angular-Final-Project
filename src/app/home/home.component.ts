import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

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
  private authToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3MTg5ZDc2Y2FhNWVjNzQ5NDQxMThkOSIsInVzZXJuYW1lIjoicGF0ZWwueWFzaGphdEBub3J0aGVhc3Rlcm4uZWR1IiwiaWF0IjoxNzMyNTk2NjY3LCJleHAiOjE3MzQ3NTY2Njd9.qU7_pZ4f2MeBbzrbJDbEsQ6zLyU3S8XEChIA8Xu0YZU';

  ngOnInit(): void {
    this.loadBlogs();
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
          title: blog.title,
          content: blog.content,
          date: blog.date,
          tags: Array.isArray(blog.tags) ? blog.tags : [],
          user: blog.user || 'Anonymous'
        }));
      }
    } catch (error) {
      console.error('Error loading blogs:', error);
    }
  }}
