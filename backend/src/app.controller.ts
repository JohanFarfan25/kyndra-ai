import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * Controlador principal
 * @author Johan Alexander Farfan Sierra <johanfarfan25@gmail.com>
 */
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
