import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
/**
 * Componente principal de la aplicación
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
export class AppComponent {
  title = 'kyndra-ai';
}
