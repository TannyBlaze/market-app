import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Market } from '../../services/market';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
})
export class Orders implements OnInit {
  orders: any[] = [];
  loading = true;

  constructor(private market: Market, private router: Router) { }

  ngOnInit() {
    this.loadOrders();
  }

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

  loadOrders() {
    this.loading = true;
    this.market.getOrders().subscribe({
      next: (res) => {
        this.orders = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load orders', err);
        this.loading = false;
        this.toast('Failed to load orders.', 'error');
      },
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
