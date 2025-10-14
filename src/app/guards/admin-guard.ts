import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Market } from '../services/market';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: Market, private router: Router) { }

  canActivate(): boolean {
    const user = this.auth.getCurrentUser();
    if (user && user.role === 'admin') {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
