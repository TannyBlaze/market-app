import { Component } from '@angular/core';
import { Market } from '../../services/market';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  imports: [CommonModule, FormsModule, RouterModule],
})
export class Login {
  email = '';
  password = '';
  showPassword = false;

  constructor(private auth: Market, private router: Router) { }

  private toast(
    message: string,
    icon: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title: message,
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        if (res.user && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));

          const name = res.user.name || 'User';
          const role = res.user.role;

          const message =
            role === 'admin'
              ? `Welcome back, Admin!`
              : `Welcome back, ${name}!`;

          this.toast(message, 'success');
          this.router.navigate(['/']);
        } else {
          this.toast('Invalid login response — check your backend.', 'error');
        }
      },
      error: (err) => this.toast(err?.error?.message || 'Login failed', 'error'),
    });
  }
}
