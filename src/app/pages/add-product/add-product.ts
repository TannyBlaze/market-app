import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Market } from '../../services/market';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { safeAlert } from '../../utils/browser';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.html',
  styleUrls: ['./add-product.css'],
})
export class AddProduct {
  name = '';
  price: number | null = null;
  image = '';
  products: any[] = [];
  editingProductId: string | null = null;

  constructor(private market: Market, private router: Router) {}

  ngOnInit() {
    this.checkAdminAccess();
    this.loadProducts();
  }

  checkAdminAccess() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user || user.role !== 'admin') {
      safeAlert('Access denied: Admins only');
      this.router.navigate(['/']);
    }
  }

  loadProducts() {
    this.market.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: () => safeAlert('Failed to load products'),
    });
  }

  save() {
    if (!this.name || this.price === null) {
      safeAlert('Please fill in all fields');
      return;
    }

    const product = { name: this.name, price: this.price, image: this.image };

    if (this.editingProductId) {
      this.market.updateProduct(this.editingProductId, product).subscribe({
        next: () => {
          safeAlert('Product updated successfully!');
          this.resetForm();
          this.loadProducts();
        },
        error: () => safeAlert('Failed to update product'),
      });
    } else {
      this.market.addProduct(product).subscribe({
        next: () => {
          safeAlert('Product added successfully!');
          this.resetForm();
          this.loadProducts();
        },
        error: () => safeAlert('Failed to add product'),
      });
    }
  }

  edit(p: any) {
    this.name = p.name;
    this.price = p.price;
    this.image = p.image;
    this.editingProductId = p._id;
  }

  delete(p: any) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    this.market.deleteProduct(p._id).subscribe({
      next: () => {
        safeAlert('Product deleted!');
        this.loadProducts();
      },
      error: () => safeAlert('Failed to delete product'),
    });
  }

  resetForm() {
    this.name = '';
    this.price = null;
    this.image = '';
    this.editingProductId = null;
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
