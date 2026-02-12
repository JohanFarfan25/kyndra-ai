import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/auth';

    constructor(private http: HttpClient) { }

    login(credentials: { username: string; password: string }): Observable<{ access_token: string }> {
        return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                localStorage.setItem('access_token', response.access_token);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('access_token');
    }

    getToken(): string | null {
        return localStorage.getItem('access_token');
    }
}