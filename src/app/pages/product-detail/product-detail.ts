import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Market } from '../../services/market';
import Swal from 'sweetalert2';

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
  ) { }

  // ✅ SweetAlert reusable toast
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

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('_id');
    if (!id) {
      this.loading = false;
      this.toast('Invalid product ID', 'error');
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
        this.toast('Product not found', 'error');
      },
    });
  }

  addToCart() {
    if (!this.product) return;
    this.market.addToCart({ ...this.product, qty: 1 });
    this.toast(`${this.product.name} added to cart!`, 'success');
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
