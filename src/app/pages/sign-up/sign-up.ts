import { Component } from '@angular/core';
import { Market } from '../../services/market';
import { Router, RouterModule } from '@angular/router';
import { safeAlert } from '../../utils/browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './sign-up.html',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class Register {
  name = '';
  email = '';
  password = '';
  constructor(private auth: Market, private router: Router) {}
  submit() {
    this.auth.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => safeAlert(err?.error?.message || 'Registration failed'),
    });
  }
}
