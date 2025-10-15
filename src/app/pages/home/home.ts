import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Market } from '../../services/market';
import Swal from 'sweetalert2';

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

  constructor(private market: Market, private router: Router) { }

  ngOnInit() {
    this.market.getProducts().subscribe({
      next: (res) => {
        this.products = res.map((p) => ({ ...p, qty: 1 }));
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.toast('Failed to load products.', 'error');
      },
    });
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

  increaseQty(product: any) {
    product.qty++;
  }

  decreaseQty(product: any) {
    if (product.qty > 1) product.qty--;
  }

  addToCart(product: any) {
    this.market.addToCart(product);
    this.toast(`${product.name} added to cart!`, 'success');
  }

  openProduct(product: any) {
    const id = product._id;
    this.router.navigate(['/product', id]);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
