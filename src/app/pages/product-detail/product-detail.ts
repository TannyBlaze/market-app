import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Market } from '../../services/market';
import { safeAlert } from '../../utils/browser';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.css'],
})
export class ProductDetail implements OnInit {
  product: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private market: Market,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('_id');
    if (!id) {
      this.loading = false;
      safeAlert('Invalid product ID');
      return;
    }

    this.market.getProduct(id).subscribe({
      next: (res) => {
        this.product = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching product:', err);
        this.loading = false;
        safeAlert('Product not found');
      },
    });
  }

  addToCart() {
    if (!this.product) return;
    this.market.addToCart({ ...this.product, qty: 1 });
    safeAlert(`${this.product.name} added to cart!`);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
