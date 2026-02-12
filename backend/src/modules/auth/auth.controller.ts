import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

/**
 * Controlador de autenticación
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  /**
   * Inicio de sesión
   * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto);
  }
}