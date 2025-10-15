import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Market } from '../../services/market';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class Checkout implements OnInit {
  total = 0;

  constructor(private market: Market, private router: Router) { }

  ngOnInit() {
    this.total = this.market.getTotal();
  }

  // ✅ Reusable SweetAlert toast
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

  placeOrder() {
    this.market.placeOrderFromCart().subscribe({
      next: () => {
        this.toast('Order placed successfully!', 'success');
        this.router.navigate(['/orders']);
      },
      error: () => this.toast('Failed to place order', 'error'),
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
