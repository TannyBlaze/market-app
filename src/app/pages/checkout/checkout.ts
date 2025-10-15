import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Market } from '../../services/market';
import { Router } from '@angular/router';
import { safeAlert } from '../../utils/browser';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css'],
})
export class Checkout implements OnInit {
  total = 0;

  constructor(private market: Market, private router: Router) {}

  ngOnInit() {
    this.total = this.market.getTotal();
  }

  placeOrder() {
    this.market.placeOrderFromCart().subscribe({
      next: () => {
        safeAlert('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: () => safeAlert('Failed to place order'),
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }
}


