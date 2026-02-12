import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

/**
 * Modulo de autenticación
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const expiresIn = config.get<string>('JWT_EXPIRES_IN')!;
        const isNumeric = /^\d+$/.test(expiresIn);
        const parsed = isNumeric ? parseInt(expiresIn, 10) : expiresIn;
        return {
          secret: config.get<string>('JWT_SECRET')!,
          signOptions: { expiresIn: parsed as any },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule { }