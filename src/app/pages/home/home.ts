import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Market } from '../../services/market';
import { safeAlert } from '../../utils/browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit {
  products: any[] = [];
  loading = true;

  constructor(private market: Market, private router: Router) {}

  ngOnInit() {
    this.market.getProducts().subscribe({
      next: (res) => {
        this.products = res.map((p) => ({ ...p, qty: 1 }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        safeAlert('Failed to load products.');
      },
    });
  }

  increaseQty(product: any) {
    product.qty++;
  }

  decreaseQty(product: any) {
    if (product.qty > 1) product.qty--;
  }

  addToCart(product: any) {
    this.market.addToCart(product);
    safeAlert(`${product.name} added to cart!`);
  }

  openProduct(product: any) {
    const id = product._id;
    this.router.navigate(['/product', id]);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
