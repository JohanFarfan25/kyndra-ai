import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './login.component.html',
})
/**
 * Componente de login
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
export class LoginComponent {
    username = '';
    password = '';

    constructor(private authService: AuthService, private router: Router) { }

    onSubmit() {
        this.authService.login({ username: this.username, password: this.password }).subscribe({
            next: () => this.router.navigate(['/chat']),
            error: (err) => Swal.fire({
                title: '¡Ups!',
                text: 'Usuario o contraseña incorrectos',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            })
        });
    }
}