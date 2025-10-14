import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Cart } from './pages/cart/cart';
import { Checkout } from './pages/checkout/checkout';
import { Orders } from './pages/orders/orders';
import { ProductDetail } from './pages/product-detail/product-detail';
import { AddProduct } from './pages/add-product/add-product';
import { AuthGuard } from './guards/auth-guard';
import { Login } from './pages/login/login';
import { Register } from './pages/sign-up/sign-up';
import { AdminGuard } from './guards/admin-guard';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'cart', component: Cart },
    { path: 'orders', component: Orders },
    { path: 'product/:_id', component: ProductDetail, data: { renderMode: 'server' } },
    { path: 'add-product', component: AddProduct, canActivate: [AdminGuard] },
    { path: 'checkout', component: Checkout, canActivate: [AuthGuard] },
    { path: 'login', component: Login },
    { path: 'signup', component: Register },
    { path: '**', redirectTo: '' },
];
