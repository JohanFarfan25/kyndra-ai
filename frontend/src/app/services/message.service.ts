import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message } from '../models/message.model';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private apiUrl = 'http://localhost:3000/messages';

    constructor(private http: HttpClient, private authService: AuthService) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
    }

    sendMessage(content: string): Observable<any> {
        return this.http.post(this.apiUrl, { content }, { headers: this.getHeaders() });
    }

    getMessages(): Observable<Message[]> {
        return this.http.get<Message[]>(this.apiUrl, { headers: this.getHeaders() });
    }

    deleteMessages(): Observable<void> {
        return this.http.delete<void>(this.apiUrl, { headers: this.getHeaders() });
    }
}