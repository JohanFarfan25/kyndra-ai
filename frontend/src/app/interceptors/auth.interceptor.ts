import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
/**
 * Interceptor de autenticación
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const token = this.authService.getToken();
        if (token) {
            const cloned = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(cloned);
        }
        return next.handle(req);
    }
}