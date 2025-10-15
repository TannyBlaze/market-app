import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Market } from '../../services/market';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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

  constructor(private market: Market, private router: Router) { }

  ngOnInit() {
    this.checkAdminAccess();
    this.loadProducts();
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

  checkAdminAccess() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    if (!user || user.role !== 'admin') {
      this.toast('Access denied: Admins only', 'error');
      this.router.navigate(['/']);
    }
  }

  loadProducts() {
    this.market.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: () => this.toast('Failed to load products', 'error'),
    });
  }

  save() {
    if (!this.name || this.price === null) {
      this.toast('Please fill in all fields', 'warning');
      return;
    }

    const product = { name: this.name, price: this.price, image: this.image };

    if (this.editingProductId) {
      this.market.updateProduct(this.editingProductId, product).subscribe({
        next: () => {
          this.toast('Product updated successfully!', 'success');
          this.resetForm();
          this.loadProducts();
        },
        error: () => this.toast('Failed to update product', 'error'),
      });
    } else {
      this.market.addProduct(product).subscribe({
        next: () => {
          this.toast('Product added successfully!', 'success');
          this.resetForm();
          this.loadProducts();
        },
        error: () => this.toast('Failed to add product', 'error'),
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
    Swal.fire({
      title: `Delete "${p.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.market.deleteProduct(p._id).subscribe({
          next: () => {
            this.toast('Product deleted!', 'success');
            this.loadProducts();
          },
          error: () => this.toast('Failed to delete product', 'error'),
        });
      }
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
