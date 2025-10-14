import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Market } from '../../services/market';
import { safeAlert } from '../../utils/browser';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css'],
})
export class Cart implements OnInit {
  items: any[] = [];

  constructor(private market: Market, private router: Router) {}

  ngOnInit() {
    this.refreshCart();
  }

  refreshCart() {
    this.items = this.market.getCart();
  }

  get total() {
    return this.market.getTotal();
  }

  remove(idOrName: any) {
    this.market.removeFromCart(idOrName);
    this.refreshCart();
  }

  increment(item: any) {
    item.qty++;
    this.refreshCart();
  }

  decrement(item: any) {
    if (item.qty > 1) {
      item.qty--;
    } else {
      this.remove(item.name);
    }
    this.refreshCart();
  }

  updateQty(item: any, event: any) {
    const value = Number(event.target.value);
    if (value >= 1) {
      item.qty = value;
    } else {
      this.remove(item.name);
    }
    this.refreshCart();
  }

  checkout() {
    if (!this.items.length) return safeAlert('Cart is empty!');
    this.router.navigate(['/checkout']);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
