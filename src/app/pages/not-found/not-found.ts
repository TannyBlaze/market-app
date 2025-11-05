import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './not-found.html',
})
export class NotFound {
  constructor(private router: Router) { }

  goHome() {
    this.router.navigate(['/']);
  }
}
