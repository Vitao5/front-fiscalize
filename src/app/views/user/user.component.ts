import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  template: `
    <h1>User Profile</h1>
    <p>User ID: {{ userId }}</p>
  `,
  standalone: true
})
export class UserComponent {
  userId: string | null = null;

  constructor(private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      this.userId = params.get('id');
    });
  }
}
