import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Market } from '../services/market';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: Market, private router: Router) {}
  canActivate() {
    return this.auth.getUser().pipe(
      map((user) => {
        if (user) return true;
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
