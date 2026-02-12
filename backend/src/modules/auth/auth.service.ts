import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

/**
 * Servicio de autenticación
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Injectable()
export class AuthService {
  private userDemo: string;
  private passwordDemo: string;

  constructor(private jwtService: JwtService, private configService: ConfigService) {
    this.userDemo = this.configService.get<string>('USER_DEMO')!;
    this.passwordDemo = this.configService.get<string>('PASSWORD_DEMO')!;
  }

  async login(credentials: { username: string; password: string }) {
    // Demo: usuario fijo para pruebas
    if (credentials.username === this.userDemo && credentials.password === this.passwordDemo) {
      const payload = { sub: this.passwordDemo, username: this.userDemo };
      return { access_token: this.jwtService.sign(payload) };
    }
    throw new UnauthorizedException('Credenciales inválidas');
  }
}