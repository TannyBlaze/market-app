import { Component } from '@angular/core';
import { Market } from '../../services/market';
import { Router, RouterModule } from '@angular/router';
import { safeAlert } from '../../utils/browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class Login {
  email = '';
  password = '';
  constructor(private auth: Market, private router: Router) {}
  submit() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        if (res.user && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          safeAlert(`Welcome back, ${res.user.role === 'admin' ? 'Admin' : 'User'}`);
          this.router.navigate(['/']);
        } else {
          safeAlert('Invalid login response — check your backend.');
        }
      },
      error: (err) => safeAlert(err?.error?.message || 'Login failed'),
    });
  }
}
