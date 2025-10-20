import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Market } from '../../services/market';
import { safeAlert } from '../../utils/browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.css'],
})
export class Orders implements OnInit {
  orders: any[] = [];

  constructor(
    private market: Market,
    private router: Router
  ) {}

  ngOnInit() {
    this.market.getOrders().subscribe({
      next: (res) => (this.orders = res),
      error: () => safeAlert('Failed to load order'),
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
