import { Component } from '@angular/core';
import { Market } from '../../services/market';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
  showPassword = false;

  constructor(private auth: Market, private router: Router) { }

  private toast(message: string, icon: 'success' | 'error' | 'warning' | 'info' = 'info') {
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
    this.auth.signup({ name: this.name, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.toast('Account created successfully!', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toast(err?.error?.message || 'Registration failed', 'error');
      },
    });
  }
}
