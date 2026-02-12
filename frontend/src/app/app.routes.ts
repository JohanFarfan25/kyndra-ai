import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ChatComponent } from './components/chat/chat.component';

/**
 * Rutas de la aplicación
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'chat', component: ChatComponent },
];
