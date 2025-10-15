import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Market {
  private api = 'https://backend-for-market-app.vercel.app/api';
  private cartItems: any[] = [];
  private cart$ = new BehaviorSubject<any[]>([]);
  private user$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user$.next(JSON.parse(savedUser));
      }
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  signup(user: { name: string; email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/auth/register`, user).pipe(
      tap((res) => {
        if (res && res.user && res.token && typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('token', res.token);
          this.user$.next(res.user);
        }
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/auth/login`, credentials).pipe(
      tap((res) => {
        if (res && res.user && res.token && typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('token', res.token);
          this.user$.next(res.user);
        }
      })
    );
  }

  logout() {
    this.user$.next(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }

  getUser(): Observable<any> {
    return this.user$.asObservable();
  }

  getCurrentUser() {
    return this.user$.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/products`, { headers: this.getAuthHeaders() });
  }

  getProduct(id: string): Observable<any> {
    return this.http.get<any>(`${this.api}/products/${id}`, { headers: this.getAuthHeaders() });
  }

  addProduct(product: { name: string; price: number; image?: string }): Observable<any> {
    return this.http.post<any>(`${this.api}/products`, product, { headers: this.getAuthHeaders() });
  }

  updateProduct(id: string, data: any): Observable<any> {
    return this.http.put<any>(`${this.api}/products/${id}`, data, { headers: this.getAuthHeaders() });
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.api}/products/${id}`, { headers: this.getAuthHeaders() });
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/orders`, { headers: this.getAuthHeaders() });
  }

  createOrder(order: { date: string; total: number; items: any[] }): Observable<any> {
    return this.http.post<any>(`${this.api}/orders`, order, { headers: this.getAuthHeaders() });
  }

  placeOrderFromCart(): Observable<any> {
    const payload = {
      date: new Date().toISOString().split('T')[0],
      total: this.getTotal(),
      items: this.getCart(),
    };
    return this.createOrder(payload).pipe(tap(() => this.clearCart()));
  }

  getCart(): any[] {
    return this.cartItems;
  }

  cartObservable(): Observable<any[]> {
    return this.cart$.asObservable();
  }

  addToCart(item: any) {
    const id = item.id || item._id;
    const existing = this.cartItems.find((i) => i.id === id || i._id === id);

    if (existing) {
      existing.qty = (existing.qty || 0) + (item.qty || 1);
    } else {
      this.cartItems.push({
        ...item,
        id: id,
        qty: item.qty || 1,
      });
    }
    this.cart$.next(this.cartItems);
  }

  removeFromCart(idOrName: number | string) {
    this.cartItems = this.cartItems.filter((i) => i.id !== idOrName && i.name !== idOrName);
    this.cart$.next(this.cartItems);
  }

  clearCart() {
    this.cartItems = [];
    this.cart$.next(this.cartItems);
  }

  getTotal(): number {
    return this.cartItems.reduce((sum, i) => sum + (i.price || 0) * (i.qty || 0), 0);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }
}
