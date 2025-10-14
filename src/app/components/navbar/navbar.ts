import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Market } from '../../services/market';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  user$: Observable<any>;

  constructor(private market: Market, private router: Router) {
    this.user$ = this.market.getUser();
  }

  logout() {
    this.market.logout();
    this.router.navigate(['/login']);
  }
}
