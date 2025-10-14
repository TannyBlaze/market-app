import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Market } from '../services/market';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: Market) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.auth.getToken();
    if (!token) return next.handle(req);
    const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next.handle(authReq);
  }
}
