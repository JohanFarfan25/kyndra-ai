import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../../services/message.service';
import { AuthService } from '../../services/auth.service';
import { Message } from '../../models/message.model';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-chat',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chat.component.html',
})
/**
 * Componente de chat
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
export class ChatComponent implements OnInit, AfterViewChecked {

    @ViewChild('scrollContainer')
    private scrollContainer!: ElementRef;

    private shouldScroll = false;

    messages: Message[] = [];
    newMessage = '';
    loading = false;

    constructor(
        private messageService: MessageService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        if (!this.authService.getToken()) {
            this.router.navigate(['/login']);
            return;
        }
        this.loadMessages();
    }

    ngAfterViewChecked(): void {
        if (this.shouldScroll) {
            this.scrollToBottom();
            this.shouldScroll = false;
        }
    }

    private scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTo({
                top: this.scrollContainer.nativeElement.scrollHeight,
                behavior: 'smooth'
            });
        } catch { }
    }

    loadMessages() {
        this.messageService.getMessages().subscribe({
            next: (msgs) => {
                this.messages = msgs;
                this.shouldScroll = true;
            },
            error: (err) => console.error(err)
        });
    }

    sendMessage() {
        if (!this.newMessage.trim() || this.loading) return;

        const content = this.newMessage;
        this.newMessage = '';
        this.loading = true;

        this.messages.push({
            content,
            role: 'user',
            userId: '',
            createdAt: new Date()
        });

        this.shouldScroll = true;

        this.messageService.sendMessage(content).subscribe({
            next: (res) => {
                this.messages.push(res.data);
                this.loading = false;
                this.shouldScroll = true;
            },
            error: (err) => {
                console.error(err);
                this.loading = false;
            }
        });
    }

    deleteConversation() {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "No podrás revertir esto. Se eliminarán todos los mensajes.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                this.loading = true;
                this.messageService.deleteMessages().subscribe({
                    next: () => {
                        this.messages = [];
                        this.loading = false;
                        Swal.fire(
                            '¡Eliminado!',
                            'Tu conversación ha sido eliminada.',
                            'success'
                        );
                    },
                    error: (err) => {
                        console.error(err);
                        this.loading = false;
                        Swal.fire(
                            'Error',
                            'No se pudo eliminar la conversación.',
                            'error'
                        );
                    }
                });
            }
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
